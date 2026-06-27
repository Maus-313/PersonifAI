"use client";

import React from 'react';

interface BaseTaskProps {
  title: string;
  description: string;
  isCompleted?: boolean;
  onToggle?: (completed: boolean) => void;
  onDelete?: () => void;
}

// 1. Simple Task Component
export const SimpleTask: React.FC<BaseTaskProps> = ({ 
  title, 
  description, 
  isCompleted = false, 
  onToggle,
  onDelete
}) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-green-900/30 flex items-center justify-between transition-all hover:shadow-md group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold rounded uppercase">Simple</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="ml-4 flex items-center gap-3">
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete sub-task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        <input 
          type="checkbox" 
          checked={isCompleted}
          onChange={(e) => onToggle?.(e.target.checked)}
          className="w-6 h-6 rounded-md border-green-300 dark:border-green-600 text-green-600 focus:ring-green-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

// 2. Lecture Task Component
interface LectureTaskProps extends BaseTaskProps {
  videoUrl: string;
}

interface ParsedVideo {
  url: string;
  embedUrl: string;
  title: string;
}

const parseVideoContent = (content: string, fallbackTitle: string): { description: string; videos: ParsedVideo[] } => {
  if (!content) return { description: '', videos: [] };

  const lines = content.split('\n');
  const videos: ParsedVideo[] = [];
  const descriptionLines: string[] = [];

  const ytUrlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}))/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(ytUrlRegex);
    if (match) {
      const fullUrl = match[1];
      const videoId = match[2];
      
      // Clean up the label
      let label = trimmed.replace(fullUrl, '');
      // Remove leading dash, bullet, or colon
      label = label.replace(/^[\s\-\*\•\d\.\)]+/, '');
      // Remove trailing colon or separator
      label = label.replace(/[\s\:\-\|]+$/, '');
      label = label.trim();

      videos.push({
        url: fullUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        title: label || fallbackTitle,
      });
    } else {
      // If it doesn't contain a YouTube link, check if it's just a raw video ID
      const rawIdMatch = trimmed.match(/^[a-zA-Z0-9_-]{11}$/);
      if (rawIdMatch) {
        videos.push({
          url: `https://www.youtube.com/watch?v=${trimmed}`,
          embedUrl: `https://www.youtube.com/embed/${trimmed}`,
          title: fallbackTitle,
        });
      } else {
        // Just description text
        descriptionLines.push(line);
      }
    }
  }

  // If no videos were found, but the content starts with http, treat the whole content as one URL
  if (videos.length === 0) {
    const cleanUrl = content.trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      const singleYtMatch = cleanUrl.match(ytUrlRegex);
      if (singleYtMatch) {
        videos.push({
          url: cleanUrl,
          embedUrl: `https://www.youtube.com/embed/${singleYtMatch[2]}`,
          title: fallbackTitle,
        });
      } else {
        // Non-YouTube absolute URL
        videos.push({
          url: cleanUrl,
          embedUrl: cleanUrl,
          title: fallbackTitle,
        });
      }
    }
  }

  return {
    description: descriptionLines.join('\n').trim(),
    videos,
  };
};

export const LectureTask: React.FC<LectureTaskProps> = ({ 
  title, 
  description, 
  videoUrl,
  isCompleted = false, 
  onToggle,
  onDelete
}) => {
  const { description: parsedDescription, videos } = parseVideoContent(videoUrl, title);
  
  const displayDescription = parsedDescription || description;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 flex flex-col justify-between gap-4 transition-all hover:shadow-md group">
      <div className="flex-1 w-full">
        {/* Header Section with action elements */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded uppercase">Lecture</span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete sub-task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <input 
              type="checkbox" 
              checked={isCompleted}
              onChange={(e) => onToggle?.(e.target.checked)}
              className="w-6 h-6 rounded-md border-red-300 dark:border-red-600 text-red-600 focus:ring-red-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Text Description */}
        {displayDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">{displayDescription}</p>
        )}

        {/* Videos Container */}
        {videos.length > 0 ? (
          <div className={`grid gap-4 ${videos.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {videos.map((vid, idx) => (
              <div key={idx} className="flex flex-col gap-2 bg-white dark:bg-gray-800/50 p-3 rounded-xl border border-red-100/50 dark:border-red-900/10 shadow-sm">
                {videos.length > 1 && (
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-1" title={vid.title}>
                    {vid.title}
                  </h4>
                )}
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md border border-red-200 dark:border-red-800">
                  <iframe 
                    className="w-full h-full"
                    src={vid.embedUrl} 
                    title={vid.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              No embedded video available. Please check the instruction description above.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Revision Task Component
export const RevisionTask: React.FC<BaseTaskProps> = ({ 
  title, 
  description, 
  isCompleted = false, 
  onToggle,
  onDelete 
}) => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl shadow-sm border border-yellow-100 dark:border-yellow-900/30 flex items-center justify-between transition-all hover:shadow-md group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded uppercase">Revision</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="ml-4 flex items-center gap-3">
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete sub-task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        <input 
          type="checkbox" 
          checked={isCompleted}
          onChange={(e) => onToggle?.(e.target.checked)}
          className="w-6 h-6 rounded-md border-yellow-300 dark:border-yellow-600 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
