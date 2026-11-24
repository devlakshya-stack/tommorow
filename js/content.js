/**
 * STILL, WITH THE SAME LOVE
 * Central Content Configuration File
 * 
 * Edit all personal text, messages, names, and song dedications here
 * without modifying any HTML or core application logic.
 */

window.EXPERIENCE_CONTENT = {
  // Personal Details
  recipient: {
    fullName: "Vanshika",
    nickname: "Chari",
    eyebrow: "A LITTLE SOMETHING FOR YOU",
    heading: "Hey, Vanshika.",
    subheading: "for Chari, with care.",
  },

  // Central Emotional Message
  themeQuote: "Even when yesterday is difficult, I don't want tomorrow to feel any less full of care.",

  // Page 1 — The Apology & Opening
  landing: {
    openingApology: "Hey Chari, I know last night wasn't easy. Maybe we still don't understand every little thing that happened, and maybe there are parts we both are still figuring out. But I don't want one difficult night to overshadow all the care I have for you.",
    followUp: "I just wanted to make something small to remind you that understanding each other matters to me, and so does showing up.",
    primaryButtonText: "There's a little more I want to say.",
    audioPromptText: "Tap here to enter with sound",
    audioActiveText: "Atmosphere sound active",
  },

  // Page 2 — Reassurance Cards
  reassurance: {
    heading: "Some things I never want you to forget.",
    subtitle: "Not promises made just for a difficult night, but things I genuinely want to work on.",
    cards: [
      {
        number: "01",
        tag: "COMMITMENT",
        title: "I will still show up",
        quote: "A difficult conversation doesn't mean I stop caring.",
        body: "Even after a disagreement, I want you to know that I am still willing to show up with the same care and willingness to understand.",
        icon: "flower-rose",
      },
      {
        number: "02",
        tag: "INTENTION",
        title: "I want to understand you",
        quote: "We might not always find the right words immediately.",
        body: "But I don't want us to stop trying to understand what the other person is feeling.",
        icon: "flower-tulip",
      },
      {
        number: "03",
        tag: "PERSPECTIVE",
        title: "We don't have to be perfect",
        quote: "We can have different perspectives. We can misunderstand things.",
        body: "What matters is how we handle those moments and how we learn from them.",
        icon: "flower-wild",
      },
      {
        number: "04",
        tag: "STEADINESS",
        title: "My care isn't temporary",
        quote: "I don't want my affection and kindness to depend on whether everything is going perfectly.",
        body: "You deserve consistency, not just good-day energy.",
        icon: "flower-bloom",
      },
      {
        number: "05",
        tag: "ACCOUNTABILITY",
        title: "Actions matter more",
        quote: "I know words can sound beautiful.",
        body: "What really matters is showing you through the way I listen, communicate, understand and behave.",
        icon: "flower-petal",
      }
    ],
    closingMessage: "Tomorrow deserves the same kindness as yesterday.",
    closingSubtext: "I don't expect everything to become perfect overnight. I just want us to keep learning how to understand each other.",
    nextButtonText: "There's something I want to dedicate to you.",
  },

  // Page 3 — Songs I Dedicate to You
  music: {
    heading: "A few songs, a few feelings.",
    subtitle: "Sometimes music says things that are difficult to put into words.",
    backgroundTrack: {
      id: "bg-ambient",
      title: "just you and me",
      artist: "For Vanshika",
      artwork: "assets/images/song-1.jpg",
      audio: "assets/music/song-1.mp3",
      synthEnabled: true, // If file is absent, generative ambient audio synth provides soothing background sound
    },
    playlist: [
      {
        id: 1,
        title: "Chaan mera ",
        audio: "assets/music/song-1.mp3",
        artwork: "assets/images/song-1.jpg",
        dedication: "Ranjha jogiya ban phirda teri yada vich kamla , Raha takda teri yaa ni tu aaja beliya .",
      },
      {
        id: 2,
        title: "Treat you better ",
        audio: "assets/music/song-2.mp3",
        artwork: "assets/images/song-2.jpg",
        dedication: "I know i can treat you better , than he can .",
      },
      {
        id: 3,
        title: "TU chahiye ",
        audio: "assets/music/song-3.mp3",
        artwork: "assets/images/song-3.jpg",
        dedication: "Seene me aagar tu dard , na koi dawa chaiye , jeene ko bas mujhe ,tu hi rehnuma chahiye .",
      },
      {
        id: 4,
        title: "Only Mine ",
        audio: "assets/music/song-4.mp3",
        artwork: "assets/images/song-4.jpg",
        dedication: "Kehta hoon itni mohabbat hai tumse, jitni falak se zameen ,Keh do na tum bhi yeh, kehne mein kya hai? Hota hai ishq yahi.",
      },
      {
        id: 5,
        title: "Till the End ",
        audio: "assets/music/song-5.mp3",
        artwork: "assets/images/song-5.jpg",
        dedication: "Baithoge jab meri baahon mein ,Kitna pyaar hai tumse bataunga ,Na main baitha rahunga teri raahon mein ,Tere sath aakhir tak chala jaunga",
      },
      {
        id: 6,
        title: "Sun mere yaar ve ",
        audio: "assets/music/song-6.mp3",
        artwork: "assets/images/song-6.jpg",
        dedication: "Sun mere yaar ve , soch ke kiya jo jaye hota nhi pyaar ve .",
      },
      {
        id: 7,
        title: "Ishq Samajh Paye  ",
        audio: "assets/music/song-7.mp3",
        artwork: "assets/images/song-7.jpg",
        dedication: "Ek Pal Bhi Tera Hona Bahut Hai ,Mujhe Tere Dil Ka Ek Kona Bahut Hai ,Aa Poori Kar De Hasrat Ke Mujhko Jaana ,Tujhse Lipat Ke Rona Bahut Hai",
      }
    ],
    closingSection: {
      eyebrow: "ONE LAST THING, CHARI",
      heading: "With care, always.",
      paragraphs: [
        "I know we won't always understand everything immediately. We might have difficult conversations, different opinions and days when finding the right words feels impossible.",
        "But I don't want those moments to make us forget that we can still be kind to each other.",
        "No matter how difficult yesterday feels, I want to keep showing up tomorrow with the same willingness to listen, the same energy to understand and the same care.",
        "You don't have to respond to this website in any particular way. I just wanted you to know that."
      ],
      signOff: "With care, always.",
      replayButtonText: "Replay this little experience"
    }
  }
};
