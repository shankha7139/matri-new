import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [mtongue, setMtongue] = useState("");
  const [prof, setProf] = useState("");
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [reli, setReli] = useState("");

  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post("http://localhost:8008/api/user/profile", {
        name,
        sex,
        mtongue,
        prof,
        desc,
        phone,
        reli,
      });
      alert("Registration Succesfull now you can login");
    } catch (error) {
      alert(error.response.data);
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-24">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Your Phone"
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Your religion"
            value={reli}
            onChange={(ev) => setReli(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Your profession"
            value={prof}
            onChange={(ev) => setProf(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Your desc"
            value={desc}
            onChange={(ev) => setDesc(ev.target.value)}
          />
          <input
            type="sex"
            placeholder="Male/Female"
            value={sex}
            onChange={(ev) => setSex(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Mother Tongue"
            value={mtongue}
            onChange={(ev) => setMtongue(ev.target.value)}
          />
          <button className="primary">Regsiter</button>
          <div className="text-center py-2 text-gray-500">
            Already have an account?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

//41.31
