import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaVolumeUp,
  FaEye,
  FaTrash,
  FaCamera,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase/Firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import "../styles/shimmer.css";
import Headers from "../Components/header";
import { getAuth, deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import { doSignOut } from "../firebase/auth";
import { auth } from "../firebase/Firebase";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const ProfileForm = () => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [adharCheck, setAdharCheck] = useState(false);
  const [payment, setpayment] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [photoLimit, setPhotoLimit] = useState(0);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Details
    name: "",
    age: "",
    height: "",
    complexion: "",
    manglic: "",
    motherTongue: "",
    subCaste: "",
    profession: "",
    state: "",
    district: "",
    pincode: "",
    specificAddress: "",
    phone: "",
    bloodGroup: "",
    email: currentUser.email,
    dateOfBirth: "",
    sex: "",
    agentRefCode: "",

    // Family Details
    caste: "",
    status: "",
    familyMembers: "",

    // Educational Details
    marks10th: "",
    marks12th: "",
    employmentStatus: "",
    organization: "",
    salary: "",
    hideSalary: false,
    workAddress: "",
    sameAsPersonalAddress: false,
    currentAddress: "",

    // Aadhaar verification
    aadhaarNumber: "",
    captcha: "",
  });

  const [photos, setPhotos] = useState([]);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAudio, setCaptchaAudio] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setpayment(userData.payment || false);
          setPaymentType(userData.paymentType || "");

          // Set photo limit based on payment status and type
          if (!userData.payment) {
            setPhotoLimit(1);
          } else {
            switch (userData.paymentType) {
              case "A":
                setPhotoLimit(6);
                break;
              case "B":
                setPhotoLimit(9);
                break;
              case "C":
                setPhotoLimit(12);
                break;
              default:
                setPhotoLimit(1);
            }
          }
        }
      }
    };

    fetchPaymentInfo();
  }, [currentUser]);

  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (formData.state) {
      fetchDistricts(formData.state);
    }
  }, [formData.state]);

  const fallbackStatesAndDistricts = {
    states: [
      { state_id: "1", state_name: "Andhra Pradesh" },
      { state_id: "2", state_name: "Arunachal Pradesh" },
      { state_id: "3", state_name: "Assam" },
      { state_id: "4", state_name: "Bihar" },
      { state_id: "5", state_name: "Chhattisgarh" },
      { state_id: "6", state_name: "Goa" },
      { state_id: "7", state_name: "Gujarat" },
      { state_id: "8", state_name: "Haryana" },
      { state_id: "9", state_name: "Himachal Pradesh" },
      { state_id: "10", state_name: "Jharkhand" },
      { state_id: "11", state_name: "Karnataka" },
      { state_id: "12", state_name: "Kerala" },
      { state_id: "13", state_name: "Madhya Pradesh" },
      { state_id: "14", state_name: "Maharashtra" },
      { state_id: "15", state_name: "Manipur" },
      { state_id: "16", state_name: "Meghalaya" },
      { state_id: "17", state_name: "Mizoram" },
      { state_id: "18", state_name: "Nagaland" },
      { state_id: "19", state_name: "Odisha" },
      { state_id: "20", state_name: "Punjab" },
      { state_id: "21", state_name: "Rajasthan" },
      { state_id: "22", state_name: "Sikkim" },
      { state_id: "23", state_name: "Tamil Nadu" },
      { state_id: "24", state_name: "Telangana" },
      { state_id: "25", state_name: "Tripura" },
      { state_id: "26", state_name: "Uttar Pradesh" },
      { state_id: "27", state_name: "Uttarakhand" },
      { state_id: "28", state_name: "West Bengal" },
    ],
    districts: {
      1: [
        // Andhra Pradesh
        { district_id: "1", district_name: "Anantapur" },
        { district_id: "2", district_name: "Chittoor" },
        { district_id: "3", district_name: "East Godavari" },
        { district_id: "4", district_name: "Guntur" },
        { district_id: "5", district_name: "Krishna" },
        { district_id: "6", district_name: "Kurnool" },
        { district_id: "7", district_name: "Prakasam" },
        { district_id: "8", district_name: "Srikakulam" },
        { district_id: "9", district_name: "Visakhapatnam" },
        { district_id: "10", district_name: "Vizianagaram" },
        { district_id: "11", district_name: "West Godavari" },
        { district_id: "12", district_name: "YSR Kadapa" },
        { district_id: "13", district_name: "Nellore" },
      ],
      2: [
        // Arunachal Pradesh
        { district_id: "14", district_name: "Anjaw" },
        { district_id: "15", district_name: "Changlang" },
        { district_id: "16", district_name: "East Kameng" },
        { district_id: "17", district_name: "East Siang" },
        { district_id: "18", district_name: "Kamle" },
        { district_id: "19", district_name: "Kra Daadi" },
        { district_id: "20", district_name: "Kurung Kumey" },
        { district_id: "21", district_name: "Lepa Rada" },
        { district_id: "22", district_name: "Lohit" },
        { district_id: "23", district_name: "Longding" },
        { district_id: "24", district_name: "Lower Dibang Valley" },
        { district_id: "25", district_name: "Lower Siang" },
        { district_id: "26", district_name: "Lower Subansiri" },
        { district_id: "27", district_name: "Namsai" },
        { district_id: "28", district_name: "Pakke Kessang" },
        { district_id: "29", district_name: "Papum Pare" },
        { district_id: "30", district_name: "Shi Yomi" },
        { district_id: "31", district_name: "Siang" },
        { district_id: "32", district_name: "Tawang" },
        { district_id: "33", district_name: "Tirap" },
        { district_id: "34", district_name: "Upper Dibang Valley" },
        { district_id: "35", district_name: "Upper Siang" },
        { district_id: "36", district_name: "Upper Subansiri" },
        { district_id: "37", district_name: "West Kameng" },
        { district_id: "38", district_name: "West Siang" },
      ],
      3: [
        // Assam
        { district_id: "39", district_name: "Baksa" },
        { district_id: "40", district_name: "Barpeta" },
        { district_id: "41", district_name: "Biswanath" },
        { district_id: "42", district_name: "Bongaigaon" },
        { district_id: "43", district_name: "Cachar" },
        { district_id: "44", district_name: "Charaideo" },
        { district_id: "45", district_name: "Chirang" },
        { district_id: "46", district_name: "Darrang" },
        { district_id: "47", district_name: "Dhemaji" },
        { district_id: "48", district_name: "Dhubri" },
        { district_id: "49", district_name: "Dibrugarh" },
        { district_id: "50", district_name: "Dima Hasao" },
        { district_id: "51", district_name: "Goalpara" },
        { district_id: "52", district_name: "Golaghat" },
        { district_id: "53", district_name: "Hailakandi" },
        { district_id: "54", district_name: "Hojai" },
        { district_id: "55", district_name: "Jorhat" },
        { district_id: "56", district_name: "Kamrup Metropolitan" },
        { district_id: "57", district_name: "Kamrup Rural" },
        { district_id: "58", district_name: "Karbi Anglong" },
        { district_id: "59", district_name: "Karimganj" },
        { district_id: "60", district_name: "Kokrajhar" },
        { district_id: "61", district_name: "Lakhimpur" },
        { district_id: "62", district_name: "Majuli" },
        { district_id: "63", district_name: "Morigaon" },
        { district_id: "64", district_name: "Nagaon" },
        { district_id: "65", district_name: "Nalbari" },
        { district_id: "66", district_name: "Sivasagar" },
        { district_id: "67", district_name: "Sonitpur" },
        { district_id: "68", district_name: "South Salmara-Mankachar" },
        { district_id: "69", district_name: "Tinsukia" },
        { district_id: "70", district_name: "Udalguri" },
        { district_id: "71", district_name: "West Karbi Anglong" },
      ],
      4: [
        // Bihar
        { district_id: "72", district_name: "Araria" },
        { district_id: "73", district_name: "Arwal" },
        { district_id: "74", district_name: "Aurangabad" },
        { district_id: "75", district_name: "Banka" },
        { district_id: "76", district_name: "Begusarai" },
        { district_id: "77", district_name: "Bhagalpur" },
        { district_id: "78", district_name: "Bhojpur" },
        { district_id: "79", district_name: "Buxar" },
        { district_id: "80", district_name: "Darbhanga" },
        { district_id: "81", district_name: "East Champaran" },
        { district_id: "82", district_name: "Gaya" },
        { district_id: "83", district_name: "Gopalganj" },
        { district_id: "84", district_name: "Jamui" },
        { district_id: "85", district_name: "Jehanabad" },
        { district_id: "86", district_name: "Kaimur" },
        { district_id: "87", district_name: "Katihar" },
        { district_id: "88", district_name: "Khagaria" },
        { district_id: "89", district_name: "Kishanganj" },
        { district_id: "90", district_name: "Lakhisarai" },
        { district_id: "91", district_name: "Madhepura" },
        { district_id: "92", district_name: "Madhubani" },
        { district_id: "93", district_name: "Munger" },
        { district_id: "94", district_name: "Muzaffarpur" },
        { district_id: "95", district_name: "Nalanda" },
        { district_id: "96", district_name: "Nawada" },
        { district_id: "97", district_name: "Patna" },
        { district_id: "98", district_name: "Purnia" },
        { district_id: "99", district_name: "Rohtas" },
        { district_id: "100", district_name: "Saharsa" },
        { district_id: "101", district_name: "Samastipur" },
        { district_id: "102", district_name: "Saran" },
        { district_id: "103", district_name: "Sheikhpura" },
        { district_id: "104", district_name: "Sheohar" },
        { district_id: "105", district_name: "Sitamarhi" },
        { district_id: "106", district_name: "Siwan" },
        { district_id: "107", district_name: "Supaul" },
        { district_id: "108", district_name: "Vaishali" },
        { district_id: "109", district_name: "West Champaran" },
      ],
      5: [
        // Chhattisgarh
        { district_id: "110", district_name: "Balod" },
        { district_id: "111", district_name: "Baloda Bazar" },
        { district_id: "112", district_name: "Balrampur" },
        { district_id: "113", district_name: "Bastar" },
        { district_id: "114", district_name: "Bemetara" },
        { district_id: "115", district_name: "Bijapur" },
        { district_id: "116", district_name: "Bilaspur" },
        { district_id: "117", district_name: "Dantewada" },
        { district_id: "118", district_name: "Dhamtari" },
        { district_id: "119", district_name: "Durg" },
        { district_id: "120", district_name: "Gariaband" },
        { district_id: "121", district_name: "Janjgir-Champa" },
        { district_id: "122", district_name: "Jashpur" },
        { district_id: "123", district_name: "Kabirdham" },
        { district_id: "124", district_name: "Kanker" },
        { district_id: "125", district_name: "Kondagaon" },
        { district_id: "126", district_name: "Korba" },
        { district_id: "127", district_name: "Korea" },
        { district_id: "128", district_name: "Mahasamund" },
        { district_id: "129", district_name: "Mungeli" },
        { district_id: "130", district_name: "Narayanpur" },
        { district_id: "131", district_name: "Raigarh" },
        { district_id: "132", district_name: "Raipur" },
        { district_id: "133", district_name: "Rajnandgaon" },
        { district_id: "134", district_name: "Sukma" },
        { district_id: "135", district_name: "Surajpur" },
        { district_id: "136", district_name: "Surguja" },
      ],
      6: [
        // Goa
        { district_id: "137", district_name: "North Goa" },
        { district_id: "138", district_name: "South Goa" },
      ],
      7: [
        // Gujarat
        { district_id: "139", district_name: "Ahmedabad" },
        { district_id: "140", district_name: "Amreli" },
        { district_id: "141", district_name: "Anand" },
        { district_id: "142", district_name: "Aravalli" },
        { district_id: "143", district_name: "Banaskantha" },
        { district_id: "144", district_name: "Bharuch" },
        { district_id: "145", district_name: "Bhavnagar" },
        { district_id: "146", district_name: "Botad" },
        { district_id: "147", district_name: "Chhota Udaipur" },
        { district_id: "148", district_name: "Dahod" },
        { district_id: "149", district_name: "Dang" },
        { district_id: "150", district_name: "Devbhoomi Dwarka" },
        { district_id: "151", district_name: "Gandhinagar" },
        { district_id: "152", district_name: "Gir Somnath" },
        { district_id: "153", district_name: "Jamnagar" },
        { district_id: "154", district_name: "Junagadh" },
        { district_id: "155", district_name: "Kheda" },
        { district_id: "156", district_name: "Kutch" },
        { district_id: "157", district_name: "Mahisagar" },
        { district_id: "158", district_name: "Mehsana" },
        { district_id: "159", district_name: "Morbi" },
        { district_id: "160", district_name: "Narmada" },
        { district_id: "161", district_name: "Navsari" },
        { district_id: "162", district_name: "Panchmahal" },
        { district_id: "163", district_name: "Patan" },
        { district_id: "164", district_name: "Porbandar" },
        { district_id: "165", district_name: "Rajkot" },
        { district_id: "166", district_name: "Sabarkantha" },
        { district_id: "167", district_name: "Surat" },
        { district_id: "168", district_name: "Surendranagar" },
        { district_id: "169", district_name: "Tapi" },
        { district_id: "170", district_name: "Vadodara" },
        { district_id: "171", district_name: "Valsad" },
      ],
      8: [
        // Haryana
        { district_id: "172", district_name: "Ambala" },
        { district_id: "173", district_name: "Bhiwani" },
        { district_id: "174", district_name: "Charkhi Dadri" },
        { district_id: "175", district_name: "Faridabad" },
        { district_id: "176", district_name: "Fatehabad" },
        { district_id: "177", district_name: "Gurugram" },
        { district_id: "178", district_name: "Hisar" },
        { district_id: "179", district_name: "Jhajjar" },
        { district_id: "180", district_name: "Jind" },
        { district_id: "181", district_name: "Kaithal" },
        { district_id: "182", district_name: "Karnal" },
        { district_id: "183", district_name: "Kurukshetra" },
        { district_id: "184", district_name: "Mahendragarh" },
        { district_id: "185", district_name: "Nuh" },
        { district_id: "186", district_name: "Palwal" },
        { district_id: "187", district_name: "Panchkula" },
        { district_id: "188", district_name: "Panipat" },
        { district_id: "189", district_name: "Rewari" },
        { district_id: "190", district_name: "Rohtak" },
        { district_id: "191", district_name: "Sirsa" },
        { district_id: "192", district_name: "Sonipat" },
        { district_id: "193", district_name: "Yamunanagar" },
      ],
      9: [
        // Himachal Pradesh
        { district_id: "194", district_name: "Bilaspur" },
        { district_id: "195", district_name: "Chamba" },
        { district_id: "196", district_name: "Hamirpur" },
        { district_id: "197", district_name: "Kangra" },
        { district_id: "198", district_name: "Kinnaur" },
        { district_id: "199", district_name: "Kullu" },
        { district_id: "200", district_name: "Lahaul and Spiti" },
        { district_id: "201", district_name: "Mandi" },
        { district_id: "202", district_name: "Shimla" },
        { district_id: "203", district_name: "Sirmaur" },
        { district_id: "204", district_name: "Solan" },
        { district_id: "205", district_name: "Una" },
      ],
      10: [
        // Jharkhand
        { district_id: "206", district_name: "Bokaro" },
        { district_id: "207", district_name: "Chatra" },
        { district_id: "208", district_name: "Deoghar" },
        { district_id: "209", district_name: "Dhanbad" },
        { district_id: "210", district_name: "Dumka" },
        { district_id: "211", district_name: "East Singhbhum" },
        { district_id: "212", district_name: "Garhwa" },
        { district_id: "213", district_name: "Giridih" },
        { district_id: "214", district_name: "Godda" },
        { district_id: "215", district_name: "Gumla" },
        { district_id: "216", district_name: "Hazaribagh" },
        { district_id: "217", district_name: "Jamtara" },
        { district_id: "218", district_name: "Khunti" },
        { district_id: "219", district_name: "Koderma" },
        { district_id: "220", district_name: "Latehar" },
        { district_id: "221", district_name: "Lohardaga" },
        { district_id: "222", district_name: "Pakur" },
        { district_id: "223", district_name: "Palamu" },
        { district_id: "224", district_name: "Ramgarh" },
        { district_id: "225", district_name: "Ranchi" },
        { district_id: "226", district_name: "Sahebganj" },
        { district_id: "227", district_name: "Seraikela Kharsawan" },
        { district_id: "228", district_name: "Simdega" },
        { district_id: "229", district_name: "West Singhbhum" },
      ],
      11: [
        // Karnataka
        { district_id: "230", district_name: "Bagalkot" },
        { district_id: "231", district_name: "Ballari" },
        { district_id: "232", district_name: "Belagavi" },
        { district_id: "233", district_name: "Bengaluru Rural" },
        { district_id: "234", district_name: "Bengaluru Urban" },
        { district_id: "235", district_name: "Bidar" },
        { district_id: "236", district_name: "Chamarajanagar" },
        { district_id: "237", district_name: "Chikballapur" },
        { district_id: "238", district_name: "Chikkamagaluru" },
        { district_id: "239", district_name: "Chitradurga" },
        { district_id: "240", district_name: "Dakshina Kannada" },
        { district_id: "241", district_name: "Davanagere" },
        { district_id: "242", district_name: "Dharwad" },
        { district_id: "243", district_name: "Gadag" },
        { district_id: "244", district_name: "Hassan" },
        { district_id: "245", district_name: "Haveri" },
        { district_id: "246", district_name: "Kalaburagi" },
        { district_id: "247", district_name: "Kodagu" },
        { district_id: "248", district_name: "Kolar" },
        { district_id: "249", district_name: "Koppal" },
        { district_id: "250", district_name: "Mandya" },
        { district_id: "251", district_name: "Mysuru" },
        { district_id: "252", district_name: "Raichur" },
        { district_id: "253", district_name: "Ramanagara" },
        { district_id: "254", district_name: "Shivamogga" },
        { district_id: "255", district_name: "Tumakuru" },
        { district_id: "256", district_name: "Udupi" },
        { district_id: "257", district_name: "Uttara Kannada" },
        { district_id: "258", district_name: "Vijayapura" },
        { district_id: "259", district_name: "Yadgir" },
      ],
      12: [
        // Kerala
        { district_id: "260", district_name: "Alappuzha" },
        { district_id: "261", district_name: "Ernakulam" },
        { district_id: "262", district_name: "Idukki" },
        { district_id: "263", district_name: "Kannur" },
        { district_id: "264", district_name: "Kasaragod" },
        { district_id: "265", district_name: "Kollam" },
        { district_id: "266", district_name: "Kottayam" },
        { district_id: "267", district_name: "Kozhikode" },
        { district_id: "268", district_name: "Malappuram" },
        { district_id: "269", district_name: "Palakkad" },
        { district_id: "270", district_name: "Pathanamthitta" },
        { district_id: "271", district_name: "Thiruvananthapuram" },
        { district_id: "272", district_name: "Thrissur" },
        { district_id: "273", district_name: "Wayanad" },
      ],
      13: [
        // Madhya Pradesh
        { district_id: "274", district_name: "Agar Malwa" },
        { district_id: "275", district_name: "Alirajpur" },
        { district_id: "276", district_name: "Anuppur" },
        { district_id: "277", district_name: "Ashoknagar" },
        { district_id: "278", district_name: "Balaghat" },
        { district_id: "279", district_name: "Barwani" },
        { district_id: "280", district_name: "Betul" },
        { district_id: "281", district_name: "Bhind" },
        { district_id: "282", district_name: "Bhopal" },
        { district_id: "283", district_name: "Burhanpur" },
        { district_id: "284", district_name: "Chhatarpur" },
        { district_id: "285", district_name: "Chhindwara" },
        { district_id: "286", district_name: "Damoh" },
        { district_id: "287", district_name: "Datia" },
        { district_id: "288", district_name: "Dewas" },
        { district_id: "289", district_name: "Dhar" },
        { district_id: "290", district_name: "Dindori" },
        { district_id: "291", district_name: "Guna" },
        { district_id: "292", district_name: "Gwalior" },
        { district_id: "293", district_name: "Harda" },
        { district_id: "294", district_name: "Hoshangabad" },
        { district_id: "295", district_name: "Indore" },
        { district_id: "296", district_name: "Jabalpur" },
        { district_id: "297", district_name: "Jhabua" },
        { district_id: "298", district_name: "Katni" },
        { district_id: "299", district_name: "Khandwa" },
        { district_id: "300", district_name: "Khargone" },
        { district_id: "301", district_name: "Mandla" },
        { district_id: "302", district_name: "Mandsaur" },
        { district_id: "303", district_name: "Morena" },
        { district_id: "304", district_name: "Narsinghpur" },
        { district_id: "305", district_name: "Neemuch" },
        { district_id: "306", district_name: "Panna" },
        { district_id: "307", district_name: "Raisen" },
        { district_id: "308", district_name: "Rajgarh" },
        { district_id: "309", district_name: "Ratlam" },
        { district_id: "310", district_name: "Rewa" },
        { district_id: "311", district_name: "Sagar" },
        { district_id: "312", district_name: "Satna" },
        { district_id: "313", district_name: "Sehore" },
        { district_id: "314", district_name: "Seoni" },
        { district_id: "315", district_name: "Shahdol" },
        { district_id: "316", district_name: "Shajapur" },
        { district_id: "317", district_name: "Sheopur" },
        { district_id: "318", district_name: "Shivpuri" },
        { district_id: "319", district_name: "Sidhi" },
        { district_id: "320", district_name: "Singrauli" },
        { district_id: "321", district_name: "Tikamgarh" },
        { district_id: "322", district_name: "Ujjain" },
        { district_id: "323", district_name: "Umaria" },
        { district_id: "324", district_name: "Vidisha" },
      ],
      14: [
        // Maharashtra
        { district_id: "325", district_name: "Ahmednagar" },
        { district_id: "326", district_name: "Akola" },
        { district_id: "327", district_name: "Amravati" },
        { district_id: "328", district_name: "Aurangabad" },
        { district_id: "329", district_name: "Beed" },
        { district_id: "330", district_name: "Bhandara" },
        { district_id: "331", district_name: "Buldhana" },
        { district_id: "332", district_name: "Chandrapur" },
        { district_id: "333", district_name: "Dhule" },
        { district_id: "334", district_name: "Gadchiroli" },
        { district_id: "335", district_name: "Gondia" },
        { district_id: "336", district_name: "Hingoli" },
        { district_id: "337", district_name: "Jalgaon" },
        { district_id: "338", district_name: "Jalna" },
        { district_id: "339", district_name: "Kolhapur" },
        { district_id: "340", district_name: "Latur" },
        { district_id: "341", district_name: "Mumbai City" },
        { district_id: "342", district_name: "Mumbai Suburban" },
        { district_id: "343", district_name: "Nagpur" },
        { district_id: "344", district_name: "Nanded" },
        { district_id: "345", district_name: "Nandurbar" },
        { district_id: "346", district_name: "Nashik" },
        { district_id: "347", district_name: "Osmanabad" },
        { district_id: "348", district_name: "Palghar" },
        { district_id: "349", district_name: "Parbhani" },
        { district_id: "350", district_name: "Pune" },
        { district_id: "351", district_name: "Raigad" },
        { district_id: "352", district_name: "Ratnagiri" },
        { district_id: "353", district_name: "Sangli" },
        { district_id: "354", district_name: "Satara" },
        { district_id: "355", district_name: "Sindhudurg" },
        { district_id: "356", district_name: "Solapur" },
        { district_id: "357", district_name: "Thane" },
        { district_id: "358", district_name: "Wardha" },
        { district_id: "359", district_name: "Washim" },
        { district_id: "360", district_name: "Yavatmal" },
      ],
      15: [
        // Manipur
        { district_id: "361", district_name: "Bishnupur" },
        { district_id: "362", district_name: "Chandel" },
        { district_id: "363", district_name: "Churachandpur" },
        { district_id: "364", district_name: "Imphal East" },
        { district_id: "365", district_name: "Imphal West" },
        { district_id: "366", district_name: "Jiribam" },
        { district_id: "367", district_name: "Kakching" },
        { district_id: "368", district_name: "Kamjong" },
        { district_id: "369", district_name: "Kangpokpi" },
        { district_id: "370", district_name: "Noney" },
        { district_id: "371", district_name: "Pherzawl" },
        { district_id: "372", district_name: "Senapati" },
        { district_id: "373", district_name: "Tamenglong" },
        { district_id: "374", district_name: "Tengnoupal" },
        { district_id: "375", district_name: "Thoubal" },
        { district_id: "376", district_name: "Ukhrul" },
      ],
      16: [
        // Meghalaya
        { district_id: "377", district_name: "East Garo Hills" },
        { district_id: "378", district_name: "East Jaintia Hills" },
        { district_id: "379", district_name: "East Khasi Hills" },
        { district_id: "380", district_name: "North Garo Hills" },
        { district_id: "381", district_name: "Ri Bhoi" },
        { district_id: "382", district_name: "South Garo Hills" },
        { district_id: "383", district_name: "South West Garo Hills" },
        { district_id: "384", district_name: "South West Khasi Hills" },
        { district_id: "385", district_name: "West Garo Hills" },
        { district_id: "386", district_name: "West Jaintia Hills" },
        { district_id: "387", district_name: "West Khasi Hills" },
      ],
      17: [
        // Mizoram
        { district_id: "388", district_name: "Aizawl" },
        { district_id: "389", district_name: "Champhai" },
        { district_id: "390", district_name: "Kolasib" },
        { district_id: "391", district_name: "Lawngtlai" },
        { district_id: "392", district_name: "Lunglei" },
        { district_id: "393", district_name: "Mamit" },
        { district_id: "394", district_name: "Saiha" },
        { district_id: "395", district_name: "Serchhip" },
      ],
      18: [
        // Nagaland
        { district_id: "396", district_name: "Dimapur" },
        { district_id: "397", district_name: "Kiphire" },
        { district_id: "398", district_name: "Kohima" },
        { district_id: "399", district_name: "Longleng" },
        { district_id: "400", district_name: "Mokokchung" },
        { district_id: "401", district_name: "Mon" },
        { district_id: "402", district_name: "Peren" },
        { district_id: "403", district_name: "Phek" },
        { district_id: "404", district_name: "Tuensang" },
        { district_id: "405", district_name: "Wokha" },
        { district_id: "406", district_name: "Zunheboto" },
      ],
      19: [
        // Odisha
        { district_id: "407", district_name: "Angul" },
        { district_id: "408", district_name: "Balangir" },
        { district_id: "409", district_name: "Balasore" },
        { district_id: "410", district_name: "Bargarh" },
        { district_id: "411", district_name: "Bhadrak" },
        { district_id: "412", district_name: "Boudh" },
        { district_id: "413", district_name: "Cuttack" },
        { district_id: "414", district_name: "Deogarh" },
        { district_id: "415", district_name: "Dhenkanal" },
        { district_id: "416", district_name: "Gajapati" },
        { district_id: "417", district_name: "Ganjam" },
        { district_id: "418", district_name: "Jagatsinghpur" },
        { district_id: "419", district_name: "Jajpur" },
        { district_id: "420", district_name: "Jharsuguda" },
        { district_id: "421", district_name: "Kalahandi" },
        { district_id: "422", district_name: "Kandhamal" },
        { district_id: "423", district_name: "Kendrapara" },
        { district_id: "424", district_name: "Kendujhar" },
        { district_id: "425", district_name: "Khordha" },
        { district_id: "426", district_name: "Koraput" },
        { district_id: "427", district_name: "Malkangiri" },
        { district_id: "428", district_name: "Mayurbhanj" },
        { district_id: "429", district_name: "Nabarangpur" },
        { district_id: "430", district_name: "Nayagarh" },
        { district_id: "431", district_name: "Nuapada" },
        { district_id: "432", district_name: "Puri" },
        { district_id: "433", district_name: "Rayagada" },
        { district_id: "434", district_name: "Sambalpur" },
        { district_id: "435", district_name: "Subarnapur" },
        { district_id: "436", district_name: "Sundargarh" },
      ],
      20: [
        // Punjab
        { district_id: "437", district_name: "Amritsar" },
        { district_id: "438", district_name: "Barnala" },
        { district_id: "439", district_name: "Bathinda" },
        { district_id: "440", district_name: "Faridkot" },
        { district_id: "441", district_name: "Fatehgarh Sahib" },
        { district_id: "442", district_name: "Fazilka" },
        { district_id: "443", district_name: "Ferozepur" },
        { district_id: "444", district_name: "Gurdaspur" },
        { district_id: "445", district_name: "Hoshiarpur" },
        { district_id: "446", district_name: "Jalandhar" },
        { district_id: "447", district_name: "Kapurthala" },
        { district_id: "448", district_name: "Ludhiana" },
        { district_id: "449", district_name: "Mansa" },
        { district_id: "450", district_name: "Moga" },
        { district_id: "451", district_name: "Muktsar" },
        { district_id: "452", district_name: "Pathankot" },
        { district_id: "453", district_name: "Patiala" },
        { district_id: "454", district_name: "Rupnagar" },
        { district_id: "455", district_name: "Sahibzada Ajit Singh Nagar" },
        { district_id: "456", district_name: "Sangrur" },
        { district_id: "457", district_name: "Shahid Bhagat Singh Nagar" },
        { district_id: "458", district_name: "Tarn Taran" },
      ],
      21: [
        // Rajasthan
        { district_id: "459", district_name: "Ajmer" },
        { district_id: "460", district_name: "Alwar" },
        { district_id: "461", district_name: "Banswara" },
        { district_id: "462", district_name: "Baran" },
        { district_id: "463", district_name: "Barmer" },
        { district_id: "464", district_name: "Bharatpur" },
        { district_id: "465", district_name: "Bhilwara" },
        { district_id: "466", district_name: "Bikaner" },
        { district_id: "467", district_name: "Bundi" },
        { district_id: "468", district_name: "Chittorgarh" },
        { district_id: "469", district_name: "Churu" },
        { district_id: "470", district_name: "Dausa" },
        { district_id: "471", district_name: "Dholpur" },
        { district_id: "472", district_name: "Dungarpur" },
        { district_id: "473", district_name: "Hanumangarh" },
        { district_id: "474", district_name: "Jaipur" },
        { district_id: "475", district_name: "Jaisalmer" },
        { district_id: "476", district_name: "Jalore" },
        { district_id: "477", district_name: "Jhalawar" },
        { district_id: "478", district_name: "Jhunjhunu" },
        { district_id: "479", district_name: "Jodhpur" },
        { district_id: "480", district_name: "Karauli" },
        { district_id: "481", district_name: "Kota" },
        { district_id: "482", district_name: "Nagaur" },
        { district_id: "483", district_name: "Pali" },
        { district_id: "484", district_name: "Pratapgarh" },
        { district_id: "485", district_name: "Rajsamand" },
        { district_id: "486", district_name: "Sawai Madhopur" },
        { district_id: "487", district_name: "Sikar" },
        { district_id: "488", district_name: "Sirohi" },
        { district_id: "489", district_name: "Sri Ganganagar" },
        { district_id: "490", district_name: "Tonk" },
        { district_id: "491", district_name: "Udaipur" },
      ],
    },
  };

  // const fetchWithFallback = async (url, options = {}) => {
  //   try {
  //     // First try with proxy
  //     const response = await fetch(url, options);
  //     if (!response.ok) throw new Error("Proxy request failed");
  //     return await response.json();
  //   } catch (proxyError) {
  //     console.log("Proxy request failed, trying CORS proxy:", proxyError);
  //     try {
  //       // Then try with CORS proxy
  //       const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
  //       const response = await fetch(corsProxyUrl, {
  //         ...options,
  //         headers: {
  //           ...options.headers,
  //           Origin: window.location.origin,
  //         },
  //       });
  //       if (!response.ok) throw new Error("CORS proxy request failed");
  //       return await response.json();
  //     } catch (corsError) {
  //       console.log("CORS proxy failed, using fallback data:", corsError);
  //       // If both fail, use fallback data
  //       if (url.includes("states")) {
  //         return { states: fallbackStates };
  //       } else if (url.includes("districts")) {
  //         return { districts: [] }; // Empty districts as fallback
  //       }
  //       throw new Error("All fetch attempts failed");
  //     }
  //   }
  // };
  const fetchStates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v2/admin/location/states");
      if (!response.ok) throw new Error("Failed to fetch states");
      const data = await response.json();
      setStates(data.states);
    } catch (error) {
      console.error("Error fetching states:", error);
      // Use fallback data
      setStates(fallbackStatesAndDistricts.states);
      setApiError("Using offline state data due to connection issues");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistricts = async (stateId) => {
    setIsLoadingDistricts(true);
    try {
      const response = await fetch(
        `/api/v2/admin/location/districts/${stateId}`
      );
      if (!response.ok) throw new Error("Failed to fetch districts");
      const data = await response.json();
      setDistricts(data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      // Use fallback data
      setDistricts(fallbackStatesAndDistricts.districts[stateId] || []);
      setApiError("Using offline district data due to connection issues");
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  // Modify the state selection handler
  const handleStateChange = (e) => {
    const selectedStateId = e.target.value;
    setFormData({
      ...formData,
      state: selectedStateId,
      district: "", // Reset district when state changes
    });
    if (selectedStateId) {
      fetchDistricts(selectedStateId);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = (acceptedFiles) => {
    const totalPhotos = photos.length + existingPhotos.length;
    const remainingSlots = photoLimit - totalPhotos;

    if (remainingSlots <= 0) {
      alert(
        `You have reached your photo limit of ${photoLimit}. Please upgrade your plan to upload more photos.`
      );
      return;
    }

    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    const formattedFiles = filesToAdd.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file,
    }));

    setPhotos([...photos, ...formattedFiles]);

    if (filesToAdd.length < acceptedFiles.length) {
      alert(
        `Only ${filesToAdd.length} photo(s) were added. You've reached your limit of ${photoLimit} photos.`
      );
    }
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const uploadProfilePhoto = async () => {
    if (profilePhotoFile) {
      const storageRef = ref(storage, `profilePhotos/${currentUser.uid}`);
      await uploadBytes(storageRef, profilePhotoFile);
      const url = await getDownloadURL(storageRef);
      return url;
    }
    return null;
  };

  const generateCaptcha = () => {
    fetch("http://127.0.0.1:8008/api/generate-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCaptchaImage("data:image/jpeg;base64," + data.imageBase64);
        setCaptchaAudio("data:audio/mpeg;base64," + data.audioBase64);
        setTransactionId(data.transactionId);
      })
      .catch((error) => console.error("Error:", error));
  };

  const verifyAadhaar = () => {
    const data = {
      aadhaar_number: formData.aadhaarNumber,
      captcha: formData.captcha,
      transaction_id: transactionId,
    };

    fetch("http://127.0.0.1:8008/api/verify-aadhaar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusMessage.includes("doesn't") || data.status === "Error") {
          setVerificationStatus(false);
          setAdharCheck(false);
        } else {
          setVerificationStatus(true);
          setAdharCheck(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setVerificationStatus(false);
        setAdharCheck(false);
      });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setFormData((prevData) => ({
              ...prevData,
              ...userDoc.data(),
            }));
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    fetchExistingPhotos();
  }, [currentUser.uid]);

  const fetchExistingPhotos = async () => {
    setIsPhotosLoading(true);
    const storageRef = ref(storage, `photos/${currentUser.uid}`);
    try {
      const result = await listAll(storageRef);
      const urlPromises = result.items.map((imageRef) =>
        getDownloadURL(imageRef)
      );
      const urls = await Promise.all(urlPromises);
      setExistingPhotos(
        urls.map((url) => ({
          url: url,
        }))
      );
      if (urls.length > 0) {
        setProfilePhoto(urls[0]);
      }
    } catch (error) {
      console.error("Error fetching existing photos:", error);
    } finally {
      setIsPhotosLoading(false);
    }
  };

  const openDeleteDialog = (photo, index) => {
    setPhotoToDelete({
      photo,
      index,
    });
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPhotoToDelete(null);
  };

  const deletePhoto = async () => {
    if (photoToDelete) {
      try {
        if (photoToDelete.photo.file) {
          setPhotos(photos.filter((_, i) => i !== photoToDelete.index));
        } else {
          const photoRef = ref(storage, photoToDelete.photo.url);
          await deleteObject(photoRef);
          setExistingPhotos(
            existingPhotos.filter((_, i) => i !== photoToDelete.index)
          );
        }
      } catch (error) {
        console.error("Error deleting photo:", error);
        alert("Failed to delete photo. Please try again.");
      }
    }
    closeDeleteDialog();
  };

  const uploadPhoto = async (photo) => {
    const storageRef = ref(storage, `photos/${currentUser.uid}/${photo.name}`);
    await uploadBytes(storageRef, photo.file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (currentPage < 3) {
  //       handleNextPage();
  //       return;
  //     }

  //     if (!adharCheck) {
  //       alert("Please verify your Aadhaar before submitting.");
  //       return;
  //     }

  //     setIsSubmitting(true);

  //     try {
  //       const newPhotoURLs = await Promise.all(photos.map(uploadPhoto));
  //       const allPhotoURLs = [
  //         ...existingPhotos.map((photo) => photo.url),
  //         ...newPhotoURLs,
  //       ];

  //       const userRef = doc(db, "users", currentUser.uid);
  //       await setDoc(
  //         userRef,
  //         {
  //           ...formData,
  //           photos: allPhotoURLs,
  //           adharVarified: adharCheck,
  //           updatedAt: new Date(),
  //         },
  //         { merge: true }
  //       );

  //       setProfileUpdated(true);
  //     } catch (err) {
  //       console.error("Error submitting profile:", err);
  //       alert("Error submitting profile");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handlePhotoUpload,
    accept: "image/*",
  });

  const playCaptchaAudio = () => {
    const audio = new Audio(captchaAudio);
    audio.play();
  };

  const handleDialogClose = () => {
    setProfileUpdated(false);
    navigate("/");
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImage("");
  };

  const openDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(true);
  };

  const closeDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(false);
  };

  const closeAndResetDeleteDialog = () => {
    closeDeleteAccountDialog();
    setDeletePassword("");
  };

  const handleDeleteAccount = async () => {
    try {
      if (!deletePassword) {
        alert("Password is required to delete your account.");
        return;
      }

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        deletePassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      await deleteDoc(doc(db, "users", currentUser.uid));

      await deleteUser(auth.currentUser);

      closeDeleteAccountDialog();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeletePassword("");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>User not found. Please log in.</div>;
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const renderPersonalDetails = () => (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
        Personal Details
      </h2>
      {/* Profile Photo Section */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FaCamera className="text-4xl text-gray-400" />
              </div>
            )}
          </div>
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: "name", placeholder: "Name", type: "text" },
          { name: "sex", placeholder: "sex", type: "text" },
          {
            name: "age",
            placeholder: "Age",
            type: "number",
            min: 23,
            max: 60,
          },
          { name: "height", placeholder: "Height", type: "text" },
          { name: "complexion", placeholder: "Complexion", type: "text" },
          {
            name: "manglic",
            placeholder: "Manglic Status",
            type: "select",
            options: ["Yes", "No"],
          },
          { name: "motherTongue", placeholder: "Mother Tongue", type: "text" },
          { name: "subCaste", placeholder: "Sub Caste", type: "text" },
          { name: "profession", placeholder: "Profession", type: "text" },
          { name: "phone", placeholder: "Phone", type: "tel" },
          { name: "bloodGroup", placeholder: "Blood Group", type: "text" },
          {
            name: "email",
            placeholder: "Email",
            type: "email",
            disabled: true,
          },
          { name: "dateOfBirth", placeholder: "Date of Birth", type: "date" },
        ].map((field) => (
          <div key={field.name} className="relative">
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                required
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                required
                {...(field.min && { min: field.min })}
                {...(field.max && { max: field.max })}
                {...(field.disabled && { disabled: field.disabled })}
              />
            )}
            <label
              htmlFor={field.name}
              className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium"
            >
              {field.placeholder}
            </label>
          </div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Keep existing personal detail fields */}

          {/* New Address Section */}
          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800">
              Address Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State Dropdown */}
              <div className="relative">
                <select
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      state: e.target.value,
                      district: "", // Reset district when state changes
                    });
                  }}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.state_id} value={state.state_id}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
                <label className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium">
                  State
                </label>
              </div>

              {/* District Dropdown */}
              <div className="relative">
                <select
                  name="district"
                  value={formData.district}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      district: e.target.value,
                    });
                  }}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                  disabled={!formData.state || isLoadingDistricts}
                >
                  <option value="">
                    {isLoadingDistricts
                      ? "Loading districts..."
                      : "Select District"}
                  </option>
                  {districts.map((district) => (
                    <option
                      key={district.district_id}
                      value={district.district_id}
                    >
                      {district.district_name}
                    </option>
                  ))}
                </select>
                <label className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium">
                  District
                </label>
              </div>

              {/* Pincode Input */}
              <div className="relative">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                />
                <label className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium">
                  Pincode
                </label>
              </div>
            </div>

            {/* Specific Address Textarea */}
            <div className="relative mt-4">
              <textarea
                name="specificAddress"
                value={formData.specificAddress}
                onChange={handleChange}
                placeholder="Enter your complete address"
                className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                required
                rows={3}
              />
              <label className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium">
                Complete Address
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const checkVarificationandPhotos = () => (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
          Aadhaar Verification and Photos
        </h2>

        <div className="space-y-6">
          {/* Aadhaar Number Input */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="text-lg font-medium text-indigo-800">
              Aadhaar Number:
            </label>
            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
              required
            />
          </div>

          {/* Captcha Section */}
          {/* <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="text-lg font-medium text-indigo-800">
              Captcha:
            </label>
            <img
              src={captchaImage}
              alt="Captcha"
              className="w-32 h-12 rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={playCaptchaAudio}
              className="p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200 ease-in-out"
            >
              <FaVolumeUp className="text-xl" />
            </button>
            <input
              type="text"
              name="captcha"
              value={formData.captcha}
              onChange={handleChange}
              className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
              required
            />
            <button
              type="button"
              onClick={generateCaptcha}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200 ease-in-out"
            >
              Refresh
            </button>
          </div> */}

          {/* Verify Aadhaar Button */}
          {/* <button
            type="button"
            onClick={verifyAadhaar}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Verify Aadhaar
          </button> */}

          {/* Verification Status */}
          {/* {verificationStatus !== null && (
            <p
              className={`mt-2 text-center text-lg font-medium ${
                verificationStatus ? "text-green-600" : "text-red-600"
              }`}
            >
              {verificationStatus
                ? "Aadhaar verified successfully"
                : "Aadhaar verification failed"}
            </p>
          )} */}

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="text-lg font-medium text-indigo-800">
              Agent ref code:
            </label>
            <input
              type="text"
              name="agentRefCode"
              value={formData.agentRefCode}
              onChange={handleChange}
              className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
              required
            />
          </div>

          {/* Photo Upload Section */}
          <p className="text-indigo-600 text-sm mb-4 text-center">
            {payment
              ? `Your current plan allows you to upload up to ${photoLimit} photos.`
              : "You can upload 1 photo. Upgrade your plan to upload more!"}
          </p>

          <div
            {...getRootProps()}
            className="border-dashed border-2 border-indigo-300 p-6 rounded-lg text-center hover:border-indigo-500 transition duration-200 ease-in-out"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-indigo-700">Drop the files here...</p>
            ) : (
              <p className="text-indigo-600">
                Drag & drop some files here, or click to select files
              </p>
            )}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[...photos, ...existingPhotos].map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                  onClick={() => handleImageClick(photo.url)}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"
                  onClick={() => openDeleteDialog(photo, index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {isPhotosLoading && (
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f49d3f]"></div>
              </div>
            )}
          </div>

          <p className="text-indigo-600 text-sm mt-4 text-center">
            {photos.length + existingPhotos.length} / {photoLimit} photos
            uploaded
          </p>
        </div>
      </div>
    </>
  );

  const renderFamilyDetails = () => (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
          Family Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              name: "caste",
              placeholder: "Caste",
              type: "text",
            },
            {
              name: "status",
              placeholder: "Marital Status",
              type: "select",
              options: [
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" },
                { value: "widowed", label: "Widowed" },
              ],
            },
            {
              name: "familyMembers",
              placeholder: "Number of Family Members",
              type: "number",
              min: 1,
            },
          ].map((field) => (
            <div key={field.name} className="relative">
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out appearance-none"
                  required
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                  {...(field.min && { min: field.min })}
                />
              )}
              <label
                htmlFor={field.name}
                className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium"
              >
                {field.placeholder}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderEducationalDetails = () => (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
          Educational and Professional Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { name: "marks10th", placeholder: "10th Marks", type: "text" },
            { name: "marks12th", placeholder: "12th Marks", type: "text" },
            {
              name: "employmentStatus",
              placeholder: "Employment Status",
              type: "select",
              options: [
                { value: "employed", label: "Employed" },
                { value: "unemployed", label: "Unemployed" },
                { value: "student", label: "Student" },
              ],
            },
          ].map((field) => (
            <div key={field.name} className="relative">
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out appearance-none"
                  required
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                />
              )}
              <label
                htmlFor={field.name}
                className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
              >
                {field.placeholder}
              </label>
            </div>
          ))}

          {formData.employmentStatus === "employed" && (
            <>
              {[
                {
                  name: "organization",
                  placeholder: "Organization",
                  type: "text",
                },
                { name: "salary", placeholder: "Salary", type: "number" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                    required
                  />
                  <label
                    htmlFor={field.name}
                    className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
                  >
                    {field.placeholder}
                  </label>
                </div>
              ))}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hideSalary"
                  checked={formData.hideSalary}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="hideSalary" className="text-indigo-800">
                  Hide Salary
                </label>
              </div>

              <div className="sm:col-span-2 relative">
                <textarea
                  name="workAddress"
                  value={formData.workAddress}
                  onChange={handleChange}
                  placeholder="Work Address"
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                  rows={3}
                />
                <label
                  htmlFor="workAddress"
                  className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
                >
                  Work Address
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="sameAsPersonalAddress"
                  checked={formData.sameAsPersonalAddress}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="sameAsPersonalAddress"
                  className="text-indigo-800"
                >
                  Same as Permanent Address
                </label>
              </div>

              {!formData.sameAsPersonalAddress && (
                <div className="sm:col-span-2 relative">
                  <textarea
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleChange}
                    placeholder="Current Address"
                    className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                    required
                    rows={3}
                  />
                  <label
                    htmlFor="currentAddress"
                    className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
                  >
                    Current Address
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return renderPersonalDetails();
      case 2:
        return renderFamilyDetails();
      case 3:
        return renderEducationalDetails();
      case 4:
        return checkVarificationandPhotos();
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPage < 4) {
      handleNextPage();
      return;
    }

    // if (!adharCheck) {
    //   alert("Please verify your Aadhaar before submitting.");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const newPhotoURLs = await Promise.all(photos.map(uploadPhoto));
      const allPhotoURLs = [
        ...existingPhotos.map((photo) => photo.url),
        ...newPhotoURLs,
      ];

      const profilePhotoURL = await uploadProfilePhoto();

      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          ...formData,
          photos: allPhotoURLs,
          profilePhoto: profilePhotoURL,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setProfileUpdated(true);
    } catch (err) {
      console.error("Error submitting profile:", err);
      alert("Error submitting profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Headers />
      <div className="min-h-screen flex items-center justify-center bg-orange-200 py-12 mt-14">
        <div className="bg-white p-6 rounded-2xl shadow-md w-4/5 neumorphic-card">
          <div className="mb-4 flex justify-between">
            <div className="w-1/3 h-2 bg-blue-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentPage / 4) * 100}%` }}
              ></div>
            </div>
            <span>Page {currentPage} of 4</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderCurrentPage()}
            <div className="flex justify-end mt-4">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg neumorphic-button mr-2"
                >
                  Previous
                </button>
              )}
              {currentPage < 4 ? (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg neumorphic-button"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-4 py-2 bg-green-500 text-white rounded-lg neumorphic-button ${
                    isSubmitting ? "opacity-50" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Dialog
        open={profileUpdated}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Profile Updated</DialogTitle>
        <DialogContent dividers>
          <p>
            Your profile has been updated successfully!will be visible to others
            after verified by Admin
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close Profile
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete Photo</DialogTitle>
        <DialogContent dividers>
          <p>Are you sure you want to delete this photo?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deletePhoto} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteAccountDialogOpen}
        onClose={closeDeleteAccountDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent dividers>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <p>Please enter your password to confirm account deletion:</p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full p-2 mt-2 rounded-lg border border-gray-300"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAndResetDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {selectedImage && (
        <Dialog open={openImageModal} onClose={handleCloseImageModal}>
          <DialogContent>
            <img src={selectedImage} alt="Selected" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
      {/* Keep existing dialogs and modals */}
    </>
  );
};

export default ProfileForm;