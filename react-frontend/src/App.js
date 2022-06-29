import axios from "axios";
import { useEffect, useState } from "react";
import config from "./config";
import Join from "./Join";
import Meeting from "./Meeting";
import MeetingEnded from "./MeetingEnded";

// Initializing the SDK
const meteredMeeting = new window.Metered.Meeting();

const API_LOCATION = config.api_location;

function App() {
  // Will set it to true when the user joins the meeting
  // and update the UI.
  const [meetingJoined, setMeetingJoined] = useState(false);
  // Storing onlineUsers, updating this when a user joins
  // or leaves the meeting
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [remoteTracks, setRemoteTracks] = useState([]);

  const [username, setUsername] = useState("");

  const [localVideoStream, setLocalVideoStream] = useState(null);

  const [micShared, setMicShared] = useState(false);
  const [cameraShared, setCameraShared] = useState(false);
  const [screenShared, setScreenShared] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState({});
  // This useEffect hooks will contain all
  // event handler, like participantJoined, participantLeft etc.
  useEffect(() => {
    meteredMeeting.on("remoteTrackStarted", (trackItem) => {
      remoteTracks.push(trackItem);
      setRemoteTracks([...remoteTracks]);
    });

    meteredMeeting.on("remoteTrackStopped", (trackItem) => {
      for (let i = 0; i < remoteTracks.length; i++) {
        if (trackItem.streamId === remoteTracks[i].streamId) {
          remoteTracks.splice(i, 1);
        }
      }
      setRemoteTracks([...remoteTracks]);
    });

    meteredMeeting.on("participantJoined", (localTrackItem) => {});

    meteredMeeting.on("participantLeft", (localTrackItem) => {});

    meteredMeeting.on("onlineParticipants", (onlineParticipants) => {
      setOnlineUsers([...onlineParticipants]);
    });

    meteredMeeting.on("localTrackUpdated", (item) => {
      const stream = new MediaStream(item.track);
      setLocalVideoStream(stream);
    });

    return () => {
      meteredMeeting.removeListener("remoteTrackStarted");
      meteredMeeting.removeListener("remoteTrackStopped");
      meteredMeeting.removeListener("participantJoined");
      meteredMeeting.removeListener("participantLeft");
      meteredMeeting.removeListener("onlineParticipants");
      meteredMeeting.removeListener("localTrackUpdated");
    };
  });

  // Will call the API to create a new
  // room and join the user.
  async function handleCreateMeeting(username) {
    // Calling API to create room
    const { data } = await axios.post(API_LOCATION + "/api/create/room");
    // Calling API to fetch Metered Domain
    const response = await axios.get(API_LOCATION + "/api/metered-domain");
    // Extracting Metered Domain and Room Name
    // From responses.
    const METERED_DOMAIN = response.data.METERED_DOMAIN;
    const roomName = data.roomName;

    // Calling the join() of Metered SDK
    const joinResponse = await meteredMeeting.join({
      name: username,
      roomURL: METERED_DOMAIN + "/" + roomName,
    });

    setUsername(username);
    setRoomName(roomName);
    setMeetingInfo(joinResponse);
    setMeetingJoined(true);
  }

  // Will call th API to validate the room
  // and join the user
  async function handleJoinMeeting(roomName, username) {
    roomName = roomName.trim();
    // Calling API to validate the roomName
    const response = await axios.get(
      API_LOCATION + "/api/validate-meeting?roomName=" + roomName
    );

    if (response.data.roomFound) {
      // Calling API to fetch Metered Domain
      const { data } = await axios.get(API_LOCATION + "/api/metered-domain");

      // Extracting Metered Domain and Room Name
      // From responses.
      const METERED_DOMAIN = data.METERED_DOMAIN;

      // Calling the join() of Metered SDK
      const joinResponse = await meteredMeeting.join({
        name: username,
        roomURL: METERED_DOMAIN + "/" + roomName,
      });

      setUsername(username);
      setRoomName(roomName);
      setMeetingInfo(joinResponse);

      setMeetingJoined(true);
    } else {
      alert("Invalid roomName");
    }
  }

  async function handleMicBtn() {
    if (micShared) {
      await meteredMeeting.stopAudio();
      setMicShared(false);
    } else {
      await meteredMeeting.startAudio();
      setMicShared(true);
    }
  }

  async function handleCameraBtn() {
    if (cameraShared) {
      await meteredMeeting.stopVideo();
      setLocalVideoStream(null);
      setCameraShared(false);
    } else {
      await meteredMeeting.startVideo();
      var stream = await meteredMeeting.getLocalVideoStream();
      setLocalVideoStream(stream);
      setCameraShared(true);
    }
  }

  async function handelScreenBtn() {
    if (!screenShared) {
      await meteredMeeting.startScreenShare();
      setScreenShared(false);
    } else {
      await meteredMeeting.stopVideo();
      setCameraShared(false);
      setScreenShared(true);
    }
  }

  async function handleLeaveBtn() {
    await meteredMeeting.leaveMeeting();
    setMeetingEnded(true);
  }

  return (
    <div className="App">
      {meetingJoined ? (
        meetingEnded ? (
          <MeetingEnded />
        ) : (
          <Meeting
            handleMicBtn={handleMicBtn}
            handleCameraBtn={handleCameraBtn}
            handelScreenBtn={handelScreenBtn}
            handleLeaveBtn={handleLeaveBtn}
            localVideoStream={localVideoStream}
            onlineUsers={onlineUsers}
            remoteTracks={remoteTracks}
            username={username}
            roomName={roomName}
            meetingInfo={meetingInfo}
            micShared={micShared}
            cameraShared={cameraShared}
            screenShared={screenShared}
          />
        )
      ) : (
        <Join
          handleCreateMeeting={handleCreateMeeting}
          handleJoinMeeting={handleJoinMeeting}
        />
      )}
    </div>
  );
}

export default App;
