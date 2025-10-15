'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  className?: string
}

export default function VideoBackground({ className = '' }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      console.log('Vídeo carregado com sucesso')
    }

    const handleError = (e: Event) => {
      console.error('Erro ao carregar vídeo:', e)
      setVideoError(true)
    }

    const handleCanPlay = () => {
      video.play().catch(error => {
        console.error('Erro ao reproduzir vídeo:', error)
        setVideoError(true)
      })
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  if (videoError) {
    return (
      <div className={`${className} bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800`} />
    )
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
      onError={() => setVideoError(true)}
    >
      <source src="/background-video.mp4" type="video/mp4" />
      <source src="./background-video.mp4" type="video/mp4" />
      <source src="background-video.mp4" type="video/mp4" />
    </video>
  )
}