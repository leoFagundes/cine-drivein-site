/* eslint-disable @next/next/no-img-element */
import React from "react";
import SectionContainer from "../../containers/sectionContainer";
import Image from "next/image";
import location from "../../../public/images/loc.png";

export default function DriveinLocation() {
  return (
    <SectionContainer
      title="LOCALIZAÇÃO"
      subtitle="Área Especial do Autódromo • Asa Norte • Brasília"
    >
      <div className="relative flex w-full h-full justify-center items-center">
        <a
          href="https://www.google.com/maps?ll=-15.778598,-47.897692&z=18&t=m&hl=en-AU&gl=US&mapclient=embed&cid=18109967453310915620"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11/12 sm:w-10/12 max-w-[1200px] h-[300px] rounded-lg  shadow-md relative overflow-hidden"
        >
          {/* <Image
            src={location.src}
            layout="fill"
            className="w-full h-full bg-center hover:cursor-pointer rounded-lg bg-cover bg-no-repeat transition-transform duration-300 ease-in-out transform hover:scale-110"
            alt="location"
          /> */}
          <div
            className="w-full h-full bg-center hover:cursor-pointer rounded-lg bg-cover bg-no-repeat transition-transform duration-300 ease-in-out transform hover:scale-110"
            style={{
              backgroundImage: `url(${location.src})`,
            }}
          />
        </a>
      </div>
    </SectionContainer>
  );
}
