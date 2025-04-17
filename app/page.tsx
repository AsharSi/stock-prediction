import Link from "next/link";
import "./home.css";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="container relative w-full h-[calc(100vh-6rem)] flex overflow-hidden">
      <div className="relative z-10 py-[5%] px-[8%] w-full flex flex-col justify-start">
        <div className="flex items-start mb-8">
          <div className="flex flex-col items-center font-medium text-sm mr-4 text-[#ffffff4d]">
            <span>A.25</span>
            <span className="w-[1px] h-8 mt-0.5 bg-[#ffffff4d]"></span>
            <span>IIT</span>
          </div>
          <h1 className="section-number">/24</h1>
        </div>
        <div className="main-content">
          <h2 className="title">Welcome to StockVision AI</h2>
          <div className="subtitle">
            <span>Your intelligent partner in proactive supply chain management</span>
            <div className="underline"></div>
          </div>
          <p className="description">
            Predict part shortages before they happen, align AI models with your
            unique risk strategy, and get instant diagnostics and insights with
            our powerful GenAI assistant. Stop reacting. Start predicting
          </p>
          <Link href="/predict" className="">
            <Button className="bg-white text-black mt-4">Get Started</Button>
          </Link>
        </div>
      </div>
      <div className="image-container"></div>
    </div>
  );
}
