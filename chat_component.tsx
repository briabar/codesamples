import { 
    useRef, 
    useEffect, 
    useState 
  } from 'react';
  import { 
    useSession 
  } from 'next-auth/react';
  import FadingText from '../FadingText';
  import { 
    Gpt3ChatBoxProp 
  } from '@/utilities/types';
  import styles from '@/styles/ChatBox.module.css';
  
  
  /**
  * This function is used to call our imageGen API.
  * @param  {string} imagePrompt the prompt that we are going to send to the imageGen api.
  * @param  {string} userId the user Id that we extract from the session. This is used in 
  * context tracking in the server side logs
  */
  async function callFlowerApi(imagePrompt: string, userId: string) {
    const response = await fetch('/api/imageGen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(imagePrompt),
    });
    // response was wrong, so let's return something that won't break our chat experience.
    if (!response.ok) {
      return "";
    }
    // shouldn't happen, but...
    if (!response.body) {
      return "";
    }
    // get the image url our of the response
    const imgUrl = await response.json()
    return imgUrl
  } 
  
  
  /**
  * This function is our main chatbox. It is what displays images as well as where we generate images.
  * @param  {Gpt3ChatBoxProp} chatContent chat content sent from chat component. Gpt3ChatBoxProp found in utilites/types.tsx
  */
  export default function Gpt3ChatBox({ chatContent }: Gpt3ChatBoxProp) {
    const scrollDown = useRef<HTMLDivElement>(null); // Ref for the last message element
    const session = useSession()
    const userProfilePicUrl = (session.data?.user as { picture?: string }).picture || '../../public/profilepics/pfpp.png'; // set user pfp using their oauth data
    const [seenContent, setSeenContent] = useState([] as string[]) //keep us from generating images for the same prompt
    const [imageUrl, setImageUrl] = useState([] as string[]) //keep track of image urls
    const userProvider = (session.data?.user as { provider?: string } | undefined)?.provider //oauth provider ie: google
    const userSub = (session.data?.user as { sub?: string } | undefined)?.sub // unique oauth subscription number
    let userId = ""
    if (!userProvider || !userSub) {
      userId = ""
    } else {
      userId = userProvider + userSub
    }
  
  
    //this function scrolls the scrollDown ref (on the chatwindow) to the bottom 
    function scrollDownOnTextAdded() {
      if (scrollDown.current) {
        scrollDown.current.scrollIntoView();
        // scrollDown.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
      }
    }
    
    
    // scroll down each time a message is added or an image url is added, keep users seeing most recent messages.
    useEffect(() => {
      scrollDownOnTextAdded()
    }, [chatContent, imageUrl]);
  
  
    /**
    * Alright, This checks if we have an image prompt in our 
    * response. It will split our content up into text before prompt, prompt, and text after.
    * After that it calls an api endpoint to generate a flower. 
    * Future notes: it's probably better to seperate out the prompt extraction from the API call
    * and the state setting on setImageUrl. For now this works, but In a future version we should def 
    * make this more modular to improve readability and make it easier to maintain.
    * @param  {string} content The content of the chat message.
    * @param  {number} index The index number that is used for generating our unique elements.
    */
    async function checkForFlower(content: string, index: number) {
      //check for fully formed flower prompts
      if (content.includes('<flower>') && content.includes('</flower>')) {
        //set the new image url with a temporary one while we generate our real image url
        setImageUrl((prevImageUrls) => {
          const newImageUrls = [...prevImageUrls];
          newImageUrls[index] = "/chat/loading.jpg";
          return newImageUrls;
        });
        //split up our content. Considered using regex (did in other versions), but
        //since I am a grug brain I decided this is more readable and easier to maintain.
        const [leftText, rightText] = content.split('<flower>');
        const [imagePrompt, remainingText] = rightText.split('</flower>');
        //start generating our image and return it once finished.
        //we have been having some issues with gateway timeouts. New server is configured for longer times,
        //but this could be an issue in the future depending on the kind of image gen we want to do.
        const imgUrl = await callFlowerApi(imagePrompt, userId)
        // update the imageUrl state variable with all our old images and add our new one
        console.log("IMAGE URL: ", imgUrl)
        setImageUrl((prevImageUrls) => {
                const newImageUrls = [...prevImageUrls];
                newImageUrls[index] = imgUrl;
                return newImageUrls;
              });     
      }
      return;
    }
  
    return (
      <div className={styles.chatbox}>
        <ul className={styles.messagebox}>
        {/* 
        This map function runs each time a new message is added to chatContent.
        It takes each message and if the message hasn't been seen it checks if there is a flower in it. 
        If there is, it generates it using checkForFlower. It then adds that message to the seen list.
        Otherwise it just maps the messages to the return below.
        We keep track of them in seen so that we don't generate images from the same prompt.
        */}
        {chatContent.map((message, index) => {
          const role = message.role;
          let content = message.content;
          if (!seenContent.includes(content)) {
            checkForFlower(content, index)
            setSeenContent([...seenContent, content])
          }
          // check if this message is the last one, this is used later for setting the scrolldown ref.
          const isLastMessage = index === chatContent.length - 1;
          // if there are any flowers in our prompt remove them.
          if (content.includes('<flower>')) {
            let left = content.split('<flower>')[0]
            let right = content.split('</flower>')[1]
            content = left + ' ' + right
          }
  
            return (
              <div key={index}
                    className={styles.chatrolescontainer}>
                {/* check if message is from the assistant or the user, format accordingly. */}
                <div
                    className={role === "assistant" ? `${styles.powerflowerprofilepic}` : `${styles.userprofilepic}`}
                    style={{
                      backgroundImage: role === "assistant" ? "../../public/profilepics/pfpp.png" : `url(${userProfilePicUrl})`,
                      backgroundSize: "cover",
                    }}
                    >
                    </div>
                <li
                  key={index}
                  className={role === "assistant" ? `${styles.powerflowerrole}` : `${styles.userrole}`}
                >
                  {
                  // if the message comes from the assistant then we add typewriter effect.
                  role === "assistant" ? <FadingText text={content} pause={false} scrollDownOnTextAdded={scrollDownOnTextAdded} speed={10}></FadingText> : content}
                  <div
                    ref={isLastMessage ? scrollDown : null}
                    key={index}
                    className={`${styles.blankmessage}`}>
                  </div>
                </li>
                {
                //below is where our images get added.
                imageUrl[index] && <img src={imageUrl[index]} className={styles.pfImage}/>
                }
                {imageUrl[index] && <div
                    ref={isLastMessage ? scrollDown : null}
                    className={`${styles.blankmessage}`}>
                  </div>
                }
                  
              </div>
            );
        })}
      </ul>
    </div>
    );
  }