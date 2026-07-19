import avatar01 from '../assets/investigation/avatars/avatar-01.webp'
import avatar02 from '../assets/investigation/avatars/avatar-02.webp'
import avatar03 from '../assets/investigation/avatars/avatar-03.webp'
import avatar04 from '../assets/investigation/avatars/avatar-04.webp'
import avatar05 from '../assets/investigation/avatars/avatar-05.webp'
import avatar06 from '../assets/investigation/avatars/avatar-06.webp'
import avatar07 from '../assets/investigation/avatars/avatar-07.webp'
import avatar08 from '../assets/investigation/avatars/avatar-08.webp'
import photo01 from '../assets/investigation/photos/photo-01.webp'
import photo02 from '../assets/investigation/photos/photo-02.webp'
import photo03 from '../assets/investigation/photos/photo-03.webp'
import photo04 from '../assets/investigation/photos/photo-04.webp'
import photo05 from '../assets/investigation/photos/photo-05.webp'
import photo06 from '../assets/investigation/photos/photo-06.webp'
import photo07 from '../assets/investigation/photos/photo-07.webp'
import photo08 from '../assets/investigation/photos/photo-08.webp'
import photo09 from '../assets/investigation/photos/photo-09.webp'
import photo10 from '../assets/investigation/photos/photo-10.webp'
import photo11 from '../assets/investigation/photos/photo-11.webp'
import photo12 from '../assets/investigation/photos/photo-12.webp'
import photo13 from '../assets/investigation/photos/photo-13.webp'
import voice011 from '../assets/investigation/audio/voices/voice-01-1.mp3'
import voice012 from '../assets/investigation/audio/voices/voice-01-2.mp3'
import voice021 from '../assets/investigation/audio/voices/voice-02-1.mp3'
import voice031 from '../assets/investigation/audio/voices/voice-03-1.mp3'
import voice041 from '../assets/investigation/audio/voices/voice-04-1.mp3'
import voice042 from '../assets/investigation/audio/voices/voice-04-2.mp3'
import voice051 from '../assets/investigation/audio/voices/voice-05-1.mp3'
import voice061 from '../assets/investigation/audio/voices/voice-06-1.mp3'
import voice062 from '../assets/investigation/audio/voices/voice-06-2.mp3'
import voice071 from '../assets/investigation/audio/voices/voice-07-1.mp3'

export const investigationPhotos = [photo01, photo02, photo03, photo04, photo05, photo06, photo07, photo08, photo09, photo10, photo11, photo12, photo13]

export const investigationAvatars = [avatar01, avatar02, avatar03, avatar04, avatar05, avatar06, avatar07, avatar08]

export type VoiceClip = { id: string; src: string }
export type VoiceGroup = { id: string; label: string; avatar: string; clips: VoiceClip[] }

export const voiceGroups: VoiceGroup[] = [
  { id: '01', label: '志愿者01', avatar: avatar01, clips: [{ id: '01-1', src: voice011 }, { id: '01-2', src: voice012 }] },
  { id: '02', label: '志愿者02', avatar: avatar02, clips: [{ id: '02-1', src: voice021 }] },
  { id: '03', label: '志愿者03', avatar: avatar03, clips: [{ id: '03-1', src: voice031 }] },
  { id: '04', label: '志愿者04', avatar: avatar04, clips: [{ id: '04-1', src: voice041 }, { id: '04-2', src: voice042 }] },
  { id: '05', label: '志愿者05', avatar: avatar05, clips: [{ id: '05-1', src: voice051 }] },
  { id: '06', label: '志愿者06', avatar: avatar06, clips: [{ id: '06-1', src: voice061 }, { id: '06-2', src: voice062 }] },
  { id: '07', label: '志愿者07', avatar: avatar07, clips: [{ id: '07-1', src: voice071 }] },
]

export type VolunteerMessage = { id: string; identity: string; avatar: string; answer: string }

export const volunteerMessages: VolunteerMessage[] = [
  { id: '01', identity: '受访者01', avatar: avatar01, answer: '没有“真不想去了”的念头。偶尔活动太早了会觉得不想起，但跟活动本身无关。' },
  { id: '02', identity: '受访者02', avatar: avatar02, answer: '有过“不想去了”的念头。后期真正没有再去是因为机构刚开始做公益，后来面向心智障碍家庭开始收费，觉得本来是公益机构要帮助心智障碍家庭，收费之后就不太想去做了。' },
  { id: '03', identity: '受访者03', avatar: avatar03, answer: '有过“不想去了”的念头——学校事情多、作业多、课多，叠加志愿活动也多，机构离学校远来回两小时，觉得很折腾很累。但只是一个念头，因为知道自己当初为什么报名，不只是责任心，本身也对这个活动有很深的情感。' },
  { id: '04', identity: '受访者04', avatar: avatar04, answer: '有过“不想去了”的念头，但不强烈。有时会有失望——期待他们给予情感回应但很多时候不会按期待方式回应。但他们后来给了很多惊喜，很多次用自己的方式回应信任和共情。' },
  { id: '05', identity: '受访者05', avatar: avatar05, answer: '没有“不想去了”的念头。' },
  { id: '06', identity: '受访者06', avatar: avatar06, answer: '没有“不想去了”的念头。很清楚做完这几次以后就没有机会再遇到了，每一次都当做最后一次志愿活动，能多参加一次就尽可能参加。' },
  { id: '07', identity: '受访者07', avatar: avatar07, answer: '有请假，是因为时间安排不过来，跟其他原因无关。' },
  { id: '08', identity: '受访者08', avatar: avatar08, answer: '如果累积到极点想暂停或退出，最主要原因是时间精力冲突（学业/工作太忙）。' },
]
