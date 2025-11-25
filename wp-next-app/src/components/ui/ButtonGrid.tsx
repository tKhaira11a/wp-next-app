"use client";
import { ButtonGridProps } from "@/types/content";
import React, {useEffect, useState} from "react";


export default function ButtonGrid( { hyperlinkListe }: ButtonGridProps) {
    const [HyperlinkListe] = useState(hyperlinkListe);

    useEffect(() => {
        const elements = document.querySelectorAll('.button-grid-container > div');

        elements.forEach((el) => {
            const element = el as HTMLElement;

            const handleMouseMove = (e: MouseEvent) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const gradient = `radial-gradient(circle 170px at ${x}px ${y}px, rgba(209, 106, 255, 0.5), rgba(32, 197, 228, 0.5))`;
                element.style.background = gradient;
            };

            const handleMouseLeave = () => {
                element.style.background = '#070c8c';
            };

            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseleave', handleMouseLeave);

            // Clean up on unmount
            return () => {
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseleave', handleMouseLeave);
            };
        });
    }, []);
    return (
        <>
            <div
                className="relative w-[66vmin] h-[30vmin] mx-auto"
            >
                <div className="button-grid-container">
                    {Object.entries(HyperlinkListe).map(([key, value]) => (
                        <div key={key}>
                            <a href={value.url} target={"_blank"}>{value.label}</a>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .button-grid-container {
                  box-shadow: 1.2px 1.2px 80px 10px rgba(32, 197, 228, 0.9);
                  width: 100%;
                  display: grid;
                  grid-template-columns: auto auto auto;
                  background-color: #d16aff;
                  position: relative;
                }
        
                .button-grid-container > div {
                  background-color: #070c8c;
                  padding: 10px;
                  font-size: 30px;
                  text-align: center;
                  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                  position: relative;
                  overflow: hidden;
                  color: #20c5e4;
                }
        
                .button-grid-container > div:hover {
                  background-color: rgba(32, 197, 228, 1);
                  color: white;
                  box-shadow: inset 0px 4px 10px rgba(7, 12, 100, 0.7);
                  cursor: pointer;
                }
        
                .button-grid-container > div a {
                  color: #20c5e4;
                }
        
                .button-grid-container > div:hover a {
                  color: white;
                }
              `}</style>
        </>
    )
}