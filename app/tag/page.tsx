"use client";

import { addDoc, collection } from "firebase/firestore";
import { useRef } from "react";
import { db } from "../api/firebase";

const Page = () => {
  const messageRef = useRef<HTMLInputElement>(null);
  const ref = collection(db, "messages");

  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = { message: messageRef.current?.value };
    try {
      addDoc(ref, data);
    } catch (error) {
      console.log(error);
      
    }
    console.log(data);
  };
  return (
    <div className="mx-8 h-full flex justify-center flex-col">
      <h1 className="text-2xl font-semibold mb-6">Just for test</h1>
      <div className="flex items-center justify-between mb-6">Ma form</div>
      <form action="" onSubmit={handleSave}>
        <input type="text" ref={messageRef} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Page;
