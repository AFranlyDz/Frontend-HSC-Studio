"use client";

import React from "react";

export const Toolbar = ({ children, className = "" }) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center">{children}</div>
    </div>
  );
};