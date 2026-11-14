import React from "react";

// 1. CONTAINER / CARD PRINCIPAL COM RESPIRO AMPLO
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  largeShadow?: boolean;
}

export function BrutalCard({
  children,
  className = "",
  largeShadow = false,
  ...props
}: CardProps) {
  const shadowClass = largeShadow
    ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div
      className={`bg-white border-2 border-black rounded-2xl p-7 md:p-10 overflow-x-hidden ${shadowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// 2. BOTÃO NEO-BRUTALISTA TÁTIL
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "muted";
}

export function BrutalButton({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-black text-white",
    secondary: "bg-white text-black",
    muted: "bg-gray-200 text-black",
  };

  return (
    <button
      disabled={disabled}
      className={`px-6 py-4 rounded-xl border-2 border-black font-sans font-extrabold text-sm md:text-base flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// 3. LABEL EDITORIAL + INPUT ESPAÇADO
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function BrutalInput({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {label && (
        <label className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white text-black px-5 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition font-sans text-sm md:text-base placeholder:text-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
}

// 4. ALERTAS DE FEEDBACK (SUCESSO / ERRO)
interface AlertProps {
  type: "success" | "error";
  message: string;
}

export function BrutalAlert({ type, message }: AlertProps) {
  const styles =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div
      className={`w-full p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-sans font-extrabold text-xs md:text-sm leading-relaxed ${styles}`}
    >
      {message}
    </div>
  );
}

// 5. DIVISOR EDITORIAL
export function BrutalDivider() {
  return <hr className="border-t-2 border-black my-8" />;
}