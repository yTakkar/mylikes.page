import React from 'react'

interface ITextLogoProps {}

const TextLogo: React.FC<ITextLogoProps> = () => {
  return (
    <div className="font-domaine-bold font-bold text-xl">
      <span className="text-mineShaft">Read This </span>
      <span className="text-brand-logo">Twice</span>
    </div>
  )
}

export default TextLogo
