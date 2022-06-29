import classNames from "classnames";
import VideoTag from "./VideoTag";

function Meeting({
  handleMicBtn,
  handleCameraBtn,
  handelScreenBtn,
  handleLeaveBtn,
  localVideoStream,
  onlineUsers,
  remoteTracks,
  username,
  roomName,
  meetingInfo,
  micShared,
  cameraShared,
  screenShared,
}) {
  let userStreamMap = {};
  for (let trackItem of remoteTracks) {
    if (!userStreamMap[trackItem.participantSessionId]) {
      userStreamMap[trackItem.participantSessionId] = [];
    }
    userStreamMap[trackItem.participantSessionId].push(trackItem);
  }

  let remoteParticipantTags = [];
  for (let user of onlineUsers) {
    // Skip if self
    if (user._id === meetingInfo.participantSessionId) {
      continue;
    }
    let videoTags = [];
    if (userStreamMap[user._id] && userStreamMap[user._id].length > 0) {
      // User has remote tracks
      for (let trackItem of userStreamMap[user._id]) {
        let stream = new MediaStream();
        stream.addTrack(trackItem.track);

        if (trackItem.type === "video") {
          videoTags.push(
            <VideoTag key={trackItem.streamId} srcObject={stream} />
          );
        }

        if (trackItem.type === "audio") {
          videoTags.push(
            <VideoTag
              key={trackItem.streamId}
              srcObject={stream}
              style={{ display: "none" }}
            />
          );
        }
      }
    }

    remoteParticipantTags.push(
      <div key={user._id}>
        <div id="remoteVideos">{videoTags}</div>
        <div id="username" className="bg-black text-white text-center">
          {user.name}
        </div>
      </div>
    );
  }

  return (
    <div id="meetingView" className="flex flex-col">
      <div className="h-8 text-center bg-black">MeetingID: {roomName}</div>
      <div
        className="flex-1 grid grid-cols-2 grid-rows-2"
        id="remoteParticipantContainer"
        style={{ display: "flex" }}
      >
        {remoteParticipantTags}
      </div>

      <div className="flex flex-col bg-base-300" style={{ width: "150px" }}>
        {localVideoStream ? (
          <VideoTag
            id="meetingAreaLocalVideo"
            muted={true}
            srcObject={localVideoStream}
            style={{
              padding: 0,
              margin: 0,
              width: "150px",
              height: "100px",
            }}
          />
        ) : (
          ""
        )}

        <div
          id="meetingAreaUsername"
          className="bg-base-300 bg-black"
          style={{
            textAlign: "center",
          }}
        >
          {username}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
        className="space-x-4"
      >
        <button
          id="meetingViewMicrophone"
          className={classNames("btn", micShared ? "btn-primary" : "")}
          onClick={handleMicBtn}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>

        <button
          id="meetingViewCamera"
          className={classNames("btn", cameraShared ? "btn-primary" : "")}
          onClick={handleCameraBtn}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>

        <button
          id="meetingViewScreen"
          className={classNames("btn", screenShared ? "btn-primary" : "")}
          onClick={handelScreenBtn}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>

        <button id="meetingViewLeave" className="btn" onClick={handleLeaveBtn}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Meeting;
