import React from "react";

export default function Card(props) {
  return (
    <div className="bg-slate-100 p-4 rounded-xl">
      <div className="group relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
            alt="Product"
            className="object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <a href="#" className="absolute inset-0" aria-hidden="true">
                {props.name}
              </a>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{props.prof}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">{props.sex}</p>
        </div>
      </div>
    </div>
  );
}
