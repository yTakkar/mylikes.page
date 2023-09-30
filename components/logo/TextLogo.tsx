import React from 'react'

interface ITextLogoProps {}

const TextLogo: React.FC<ITextLogoProps> = () => {
  return (
    <div className="font-domaine-bold font-bold text-xl">
      <span className="text-typo-title">MY </span>
      <span className="text-brand-logo">LIKES</span>
    </div>
  )
}

export default TextLogo
