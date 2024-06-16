import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function Card(props) {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-slate-100 p-4 rounded-xl relative ">
        <div className="relative">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none hover:opacity-75 lg:h-80">
            <img
              src={props.dp}
              alt="Product"
              className="object-cover object-center lg:h-full lg:w-full"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm ">
                <a
                  href="#"
                  className="absolute top-2 left-2 bg-gray-200 px-2 py-1 rounded-full "
                  aria-hidden="true"
                >
                  {props.name}
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{props.prof}</p>
            </div>

            <p className="text-sm font-medium text-gray-900">{props.sex}</p>
          </div>
        </div>
        <div
          className="absolute p-4 bg-rose-500 rounded-full text-white right-3 top-3 cursor-pointer "
          onClick={() => navigate("/chat", { state: { chatId: props.chatId } })}
        >
          <AiOutlineSend />
        </div>
      </div>
    </>
  );
}
