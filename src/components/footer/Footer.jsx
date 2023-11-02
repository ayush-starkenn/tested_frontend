import { Dialog } from "primereact/dialog";
import { useState } from "react";

const Footer = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const openPrivacyPolicyDialog = () => {
    setIsPrivacyPolicyOpen(true);
  };

  const closePrivacyPolicyDialog = () => {
    setIsPrivacyPolicyOpen(false);
  };
  const openTermsDialog = () => {
    setIsTermsOpen(true);
  };

  const closeTermsDialog = () => {
    setIsTermsOpen(false);
  };
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <h5 className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
        <div className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()} &nbsp;
          <a
            href="https://starkenn.com/"
            className="hover:underline"
            target="blank"
          >
            Starkenn Technologies
          </a>
          &nbsp;&nbsp;
          <div className="heartbeat">
            <span>❤️</span>
          </div>
          &nbsp;All Rights Reserved.
        </div>
      </h5>
      <div>
        <ul className="footer-content flex flex-wrap items-center gap-3 sm:flex-wrap md:gap-10">
          {/* <li>
            <a
              target="blank"
              href="https://www.starkenn.com/contact-us"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Support
            </a>
          </li> */}
          <li>
            <button
              onClick={openTermsDialog}
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Terms & Conditions
            </button>
          </li>
          <li>
            <button
              onClick={openPrivacyPolicyDialog}
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Privacy Policy
            </button>
          </li>
        </ul>
      </div>
      <Dialog
        visible={isPrivacyPolicyOpen}
        onHide={closePrivacyPolicyDialog}
        header="Privacy Policy"
        modal
        style={{ width: "50vw" }}
      >
        {/* Include your privacy policy content here */}
        <p className="font-bold">This is the privacy policy content:</p>
        <ul className="px-5" style={{ listStyle: "square" }}>
          <li className="py-2 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe iure
            quasi nemo, tempora impedit soluta inventore repellendus velit modi
            recusandae magnam praesentium numquam tempore amet suscipit quae
            totam eius quo.
          </li>
          <li className="pb-2 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus ab dolores quasi error ducimus illum explicabo
            consectetur tempore quaerat est hic quo, dignissimos suscipit, id
            adipisci tenetur rerum, molestias cumque.
          </li>
          <li className="pb-2 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eius
            blanditiis facere accusamus! In pariatur quod suscipit repellendus
            hic voluptatem aut labore consequuntur sint quasi, quos dolorum
            repudiandae nesciunt optio!
          </li>
          <li className="pb-2 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet,
            harum id? Odio nisi nam minima vero nihil a, eos, nostrum saepe
            consequuntur dolores quidem adipisci dicta ab excepturi vel ratione.
          </li>
        </ul>
      </Dialog>
      <Dialog
        visible={isTermsOpen}
        onHide={closeTermsDialog}
        header="Terms and Conditions"
        modal
        style={{ width: "50vw" }}
      >
        {/* Include your privacy policy content here */}
        <p className="font-bold">These are the terms and conditions:</p>
        <ul className="px-5" style={{ listStyle: "square" }}>
          <li className="py-2 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe iure
            quasi nemo, tempora impedit soluta inventore repellendus velit modi
            recusandae magnam praesentium numquam tempore amet suscipit quae
            totam eius quo.
          </li>
          <li className="pb-2 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus ab dolores quasi error ducimus illum explicabo
            consectetur tempore quaerat est hic quo, dignissimos suscipit, id
            adipisci tenetur rerum, molestias cumque.
          </li>
          <li className="pb-2 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eius
            blanditiis facere accusamus! In pariatur quod suscipit repellendus
            hic voluptatem aut labore consequuntur sint quasi, quos dolorum
            repudiandae nesciunt optio!
          </li>
          <li className="pb-2 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet,
            harum id? Odio nisi nam minima vero nihil a, eos, nostrum saepe
            consequuntur dolores quidem adipisci dicta ab excepturi vel ratione.
          </li>
        </ul>
      </Dialog>
    </div>
  );
};

export default Footer;
