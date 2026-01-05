// components/VideoCarousel.tsx
'use client'

import { useState } from 'react'
import Icon from '@/components/Icon'

interface Video {
    id: string
    title: string
    youtube_id: string
    thumbnail: string
    duration?: number
}

export function VideoCarousel({ videos }: { videos: Video[] }) {
    const [current, setCurrent] = useState(videos.length - 1)

    const next = () => setCurrent((current + 1) % videos.length)
    const prev = () => setCurrent((current - 1 + videos.length) % videos.length)

    const video = videos[current]

    return (
        <div className="relative">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                    <a
                        href={`https://rswfire.com/transmission/${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-teal-600 hover:text-teal-700 hover:underline"
                    >
                        {video.id}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Video {current + 1} of {videos.length}</p>
                </div>

                <div className="flex gap-2 ml-4">
                    <button
                        onClick={prev}
                        disabled={videos.length <= 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Icon name="ChevronLeft" size={20} />
                    </button>
                    <button
                        onClick={next}
                        disabled={videos.length <= 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Icon name="ChevronRight" size={20} />
                    </button>
                </div>
            </div>

            {videos.length > 1 && (
                <div className="mt-4 flex gap-2 justify-center">
                    {videos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-2 rounded-full transition-all ${
                                idx === current ? 'w-8 bg-teal-600' : 'w-2 bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
