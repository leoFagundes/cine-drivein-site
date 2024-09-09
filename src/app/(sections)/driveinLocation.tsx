/* eslint-disable @next/next/no-img-element */
import React from "react";
import SectionContainer from "../../containers/sectionContainer";
import location from "../../../public/images/loc-v2.png";
import locationSmall from "../../../public/images/loc-v3.png";

export default function DriveinLocation() {
  return (
    <SectionContainer
      id="location"
      title="LOCALIZAÇÃO"
      subtitle="Área Especial do Autódromo • Asa Norte • Brasília"
    >
      <div className="relative flex w-full h-full justify-center items-center">
        <a
          href="https://www.google.com/maps?ll=-15.778598,-47.897692&z=18&t=m&hl=en-AU&gl=US&mapclient=embed&cid=18109967453310915620"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11/12 sm:w-10/12 max-w-[970px] h-[317px] rounded-lg  shadow-md relative overflow-hidden"
        >
          <div
            className="hidden md:block w-full h-full bg-center hover:cursor-pointer rounded-lg bg-cover bg-no-repeat transition-transform duration-300 ease-in-out transform hover:scale-105"
            style={{
              backgroundImage: `url(${location.src})`,
            }}
          />
          <div
            className="block md:hidden w-full h-full bg-center hover:cursor-pointer rounded-lg bg-cover bg-no-repeat transition-transform duration-300 ease-in-out transform hover:scale-105"
            style={{
              backgroundImage: `url(${locationSmall.src})`,
            }}
          />
        </a>
      </div>
    </SectionContainer>
  );
}
