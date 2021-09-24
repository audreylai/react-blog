import React from "react";

import "../styles/Sidebar.css";

import mio from "../assets/mio2.jpeg";
import one from "../assets/1.png";
import two from "../assets/2.png";
import three from "../assets/3.png";
import four from "../assets/4.png";
import five from "../assets/5.png";
import six from "../assets/6.png";
import seven from "../assets/7.png";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="header">My Blog</h1>
      <div className="bio">
        <div className="avatar">
          <img className="avatar-image" src={mio} alt="profile_image" />
        </div>
        <div className="avatar-description">
          <h2 className="avatar-description-header">Mio Naganohara</h2>
          <p className="avatar-description-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Viverra
            adipiscing at in tellus integer feugiat scelerisque varius morbi.
            Tempus iaculis urna id volutpat.
          </p>
        </div>
      </div>
      <div className="gallery">
        <div class="row">
          <div class="row-cell row-cell-25">
            <div className="img-hover-zoom">
              <img className="row-cell-image" src={one} alt="" />
            </div>
            <div className="img-hover-zoom">
              <img className="row-cell-image" src={four} alt="" />
            </div>{" "}
          </div>

          <div class="row-cell row-cell-35">
            <div className="img-hover-zoom">
              <img className="row-cell-image" src={two} alt="" />
            </div>
            <div className="img-hover-zoom">
              <img className="row-cell-image" src={six} alt="" />
            </div>
            <div className="img-hover-zoom">
              <img className="row-cell-image" src={seven} alt="" />
            </div>
          </div>
          
          <div class="row-cell row-cell-fit">
            <div className="img-hover-zoom">
              <img className="row-cell-image" src={three} alt="" />
            </div>{" "}
            <div className="img-hover-zoom">
              <img className="row-cell-image" src={five} alt="" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
