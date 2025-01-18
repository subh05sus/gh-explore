"use client";
import React from "react";
import { Github, Star } from "lucide-react";
import { Button } from "./ui/button";

const FloatingButton = () => {

  return (
    <div className="fixed bottom-5 right-5">
      <Button
        onClick={() =>{
            window.open("https://github.com/subh05sus/gh-explore", "_blank")
        }}     
          className=" rounded-full shadow-lg flex items-center justify-center  text-center"
          title="View Source Code and Star on GitHub"
        >
          <Github className="inline " /> <span className="text-xs">View Source Code and <Star className="inline mr-1 fill-secondary"/>Star</span>
       
      </Button>
    </div>
  );
};

export default FloatingButton;
