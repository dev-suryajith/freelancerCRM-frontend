import React, { useEffect, useState } from "react";
import Chat from "../../common/components/Chat";
import { getFreelancerAPI } from "../../services/allAPI";

function ClientChat() {
  const [userId, setUserId] = useState("");
  const [freelancerId, setFreelancerId] = useState("");

  const loggedUser = JSON.parse(
    sessionStorage.getItem("loggedUserDetails")
  );
  const token = sessionStorage.getItem("token");

  const reqHeader = {
    Authorization: `Bearer ${token}`,
  };

  // set logged-in user
  useEffect(() => {
    if (loggedUser?._id) {
      setUserId(loggedUser._id);
    }
  }, [loggedUser]);

  // fetch freelancer
  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const res = await getFreelancerAPI(reqHeader);
        if (res.status === 200 && res.data?._id) {
          setFreelancerId(res.data._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFreelancer();
  }, []);

  return (
    <div className="h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto h-full rounded-xl overflow-hidden shadow-lg border border-gray-800">
        {userId && freelancerId ? (
          <Chat
            currentUserId={userId}
            otherUserId={freelancerId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading chat...
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientChat;
