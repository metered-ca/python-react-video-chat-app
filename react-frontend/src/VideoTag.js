import classNames from "classnames";
import { useEffect, useRef } from "react";

function VideoTag(props) {
  const video = useRef();
  const srcObject = props.srcObject;
  const src = props.src;
  const style = props.style;

  const className = classNames(
    "static shadow-lg bg-slate-900 max-w-full max-h-full",
    props.className
  );
  function handleCanPlay() {
    video.current.play();
  }

  useEffect(() => {
    if (srcObject && video.current) {
      video.current.srcObject = srcObject;
    }
  });

  return (
    <>
      <video
        style={style}
        ref={video}
        onCanPlay={handleCanPlay}
        playsInline
        className={className}
        autoPlay={true}
        src={src}
      />
    </>
  );
}

export default VideoTag;
