// =====================
//  Third-Party Imports
// =====================
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// =====================
//  UI & Icons Imports
// =====================
import { zodResolver } from "@hookform/resolvers/zod";
import { SlOptions } from "react-icons/sl";
import { GoPaperclip } from "react-icons/go";
import { IoIosSend } from "react-icons/io";
import style from "./style.module.css";

// =====================
//  Context & API Imports
// =====================
import { SelectContext } from "../../Context/useSelectContext";
import { UserContext } from "../../Context/userContext";
import { useSocket } from "../../Socket/SocketContext";
import apiClient from "../../api/apiClient";
import MessagesUser from "../../api/useMessages";

// =====================
//  Schema & Types Imports
// =====================
import { sendMessageForm, sendMessageSchema } from "../../Schemas/sendMessage";
import { Messages } from "../../types/message";

// =====================
//  Component Imports
// =====================
import IsLoading from "../isLoading";
import Message from "./Message";
import WelcomeChat from "./WelcomeChat";
import ModalComponent from "../Modal";
import UserSelectedModal from "./UserSelectedModal";

// =====================
//  Component Props Type
// =====================
type Props = {};

// =====================
//  Chat Component
// =====================
const Chat = ({}: Props) => {
  // ----------------------------
  // Local State & Ref Initialization
  // ----------------------------

  // Holds all chat messages.
  const [messages, setMessages] = useState<Messages[]>([]);

  // Manage auto-scroll behavior.
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // ----------------------------
  // File Upload State & Types
  // ----------------------------
  // Extend File type with a preview URL.
  type FileWithPreview = File & { preview: string };

  // State for file upload and preview URL.
  const [file, setFile] = useState<FileWithPreview[]>([]);
  const [preview, setPreview] = useState("");

  // ----------------------------
  // Pagination & Fetching States
  // ----------------------------
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // State to manage user settings modal visibility.
  const [userSelectedModal, setUserSelectedModal] = useState<boolean>(false);

  // Reference to the container that holds the messages.
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ----------------------------
  // Contexts & Custom Hooks
  // ----------------------------
  const { userSelected } = useContext(SelectContext);
  const { user } = useContext(UserContext);
  const { socket } = useSocket();

  // Retrieve messages data from the API based on the selected user.
  const { data, isFetching } = MessagesUser(userSelected?.username || "");

  // Reference to the hidden file input element.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------
  // React Hook Form Setup with Zod Validation
  // ----------------------------
  const { register, handleSubmit, reset } = useForm<sendMessageForm>({
    resolver: zodResolver(sendMessageSchema),
  });

  // ----------------------------
  // Socket Listener: Listen for incoming messages
  // ----------------------------
  useEffect(() => {
    // Callback to handle an incoming message.
    const messageListener = (data: Messages) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    // Subscribe to the socket event.
    socket?.on("messageReveived", messageListener);

    // Cleanup the listener on unmount or if socket changes.
    return () => {
      socket?.off("messageReveived", messageListener);
    };
  }, [socket]);

  // ----------------------------
  // Fetch Initial Messages & Auto-scroll on User Change
  // ----------------------------
  useEffect(() => {
    if (userSelected) {
      const getMessages = async () => {
        // Set messages only if data exists.
        if (data) {
          setMessages(data.messages);
        }
      };
      getMessages();
    }
    // After messages are loaded, scroll to the bottom.
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [userSelected, data]);

  // ----------------------------
  // Auto-scroll Effect when Messages Update
  // ----------------------------
  useLayoutEffect(() => {
    if (isAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isAutoScroll]);

  // Handler User Selected Modal
  const ModalUserSelected = (open?: boolean) => {
    setUserSelectedModal(!open);
  };

  // ----------------------------
  // Scroll Handler: Update auto-scroll state and fetch older messages if needed
  // ----------------------------
  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (container) {
      // Determine if the user is near the bottom.
      const bottomThreshold = 50;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + bottomThreshold;
      setIsAutoScroll(isAtBottom);

      // If the user scrolls near the top, try to load older messages.
      const topThreshold = 100;
      if (
        container.scrollTop < topThreshold &&
        hasMoreMessages &&
        !isFetchingMore
      ) {
        setIsFetchingMore(true);
        const prevScrollHeight = container.scrollHeight;
        const nextPage = currentPage + 1;
        // Fetch older messages for the next page.
        const { messages: olderMessages, hasMore } = await fetchOldMessages(
          nextPage
        );

        // If older messages are found, prepend them to the current list.
        if (olderMessages.length > 0) {
          setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
          setCurrentPage(nextPage);
          setHasMoreMessages(hasMore);
          // Adjust scroll position to maintain current view.
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const newScrollHeight = messagesContainerRef.current.scrollHeight;
              messagesContainerRef.current.scrollTop =
                newScrollHeight - prevScrollHeight;
            }
          }, 0);
        } else {
          setHasMoreMessages(false);
        }
        setIsFetchingMore(false);
      }
    }
  };

  // ----------------------------
  // Helper Function: Fetch Older Messages from API
  // ----------------------------
  const fetchOldMessages = async (page: number) => {
    try {
      const response = await apiClient.get(
        `/user/messages/${userSelected?.username}/${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching old messages:", error);
      return { messages: [], hasMore: false };
    }
  };

  // ----------------------------
  // Event Handler: Handle Message Submission
  // ----------------------------
  const onSubmit = async (formDataInput: sendMessageForm) => {
    // Create FormData for the API request.
    const formData = new FormData();
    if (file.length > 0) {
      formData.append("image", file[0]);
    }
    // Append required fields.
    formData.append("receipterUser", userSelected?.username || "");
    formData.append("text", formDataInput.message);

    // Reset the form and clear file preview.
    reset();
    setFile([]);
    setPreview("");

    // Create a temporary message for an optimistic update.
    const tempMessage = {
      sender: user?._id || "Unknown",
      imgURL: file.length > 0 ? file[0].preview : "",
      text: formDataInput.message,
      _id: Date.now(), // Temporary ID; replace with API ID if needed.
    };

    // Optimistically update the UI.
    setMessages((prevMessages) => [...prevMessages, tempMessage]);

    try {
      const URL = `/user/message`;
      // Send the message to the server.
      const sentMessage = await apiClient.post<{
        message: string;
        saveMessage: Messages;
      }>(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Include authentication headers if needed.
        },
      });

      // If a socket connection exists, emit the private message event.
      if (socket) {
        socket.emit("private_message", {
          to: userSelected?.username,
          imgURL: sentMessage.data.saveMessage.imgURL || "",
          message: formDataInput.message,
          sender: user?.username,
        });
      }
    } catch (error) {
      // On error, remove the temporary message from the UI.
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== tempMessage._id)
      );
      // Display error notification.
      if (error instanceof Error) {
        toast.error((error as any).response?.data.message);
      } else {
        console.error("Error sending the message:", error);
      }
    }
  };

  // ----------------------------
  // Event Handler: File Input Change (Image Upload)
  // ----------------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Get the first selected file.
    if (selectedFile) {
      // Create a preview URL for the selected image.
      const previewUrl = URL.createObjectURL(selectedFile);
      const fileWithPreview: FileWithPreview = Object.assign(selectedFile, {
        preview: previewUrl,
      });
      setPreview(previewUrl); // Update preview state.
      setFile([fileWithPreview]); // Save file to state.
    }
  };

  // ----------------------------
  // Event Handler: Open File Dialog for Image Upload
  // ----------------------------
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // ----------------------------
  // Early Return: If no user is selected, show a welcome message
  // ----------------------------
  if (!userSelected) return <WelcomeChat />;

  // ----------------------------
  // Render: Chat Interface
  // ----------------------------
  return (
    <div className={style.chat}>
      {/* Chat Header */}
      <div className={style.chat__header}>
        <span>{userSelected.username}</span>
        <i onClick={() => ModalUserSelected()}>
          <SlOptions />
        </i>
      </div>

      {/* Chat Messages Wrapper */}
      <div className={style.chat__messages_wrapper}>
        <div
          className={style.chat__messages}
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {/* Show loader if fetching messages */}
          {(isFetching || isFetchingMore) && <IsLoading />}
          {/* Render all chat messages */}
          {messages.map((message, index) => (
            <Message
              key={index}
              isUser={message.sender.toString() === user?._id.toString()}
              message={message.text}
              imgURL={message.imgURL}
              onLoad={() => {
                // Called when an image in the message loads
                if (isAutoScroll && messagesContainerRef.current) {
                  messagesContainerRef.current.scrollTop =
                    messagesContainerRef.current.scrollHeight;
                }
              }}
            />
          ))}
        </div>

        {/* Preview Section for Uploaded Image */}
        {file.length > 0 && (
          <div className={style.chat__filepreview}>
            <img
              src={preview}
              alt="Preview"
              onClick={() => {
                // Clear file and preview if the preview is clicked.
                setFile([]);
                setPreview("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Chat Input Form */}
      <div className={style.chat__form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Textarea for message input; supports sending with Enter (without Shift) */}
          <textarea
            {...register("message")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          ></textarea>

          {/* Icon for file/image upload */}
          <i onClick={handleImageClick}>
            <GoPaperclip />
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </i>

          {/* Submit button */}
          <button type="submit">
            <IoIosSend />
          </button>
        </form>
      </div>
      <ModalComponent handleModel={ModalUserSelected} open={userSelectedModal}>
        <UserSelectedModal
          handleModel={ModalUserSelected}
          userSelected={userSelected}
        />
      </ModalComponent>
    </div>
  );
};

export default Chat;
