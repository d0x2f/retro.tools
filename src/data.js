import {
  PlusIcon,
  FrownIcon,
  MehIcon,
  SmileIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  DeleteIcon,
  StarIcon,
  TrendingUpIcon,
  HeartIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  XIcon,
  GithubIcon,
} from 'svelte-feather-icons';

export const Colors = {
  green: {
    selected: 'text-success border-success',
    deselected: 'text-success',
    color: 'text-success border-success',
  },
  blue: {
    selected: 'text-primary border-primary',
    deselected: 'text-primary',
    color: 'text-primary border-primary',
  },
  red: {
    selected: 'text-danger border-danger',
    deselected: 'text-danger',
    color: 'text-danger border-danger',
  },
  yellow: {
    selected: 'text-warning border-warning',
    deselected: 'text-warning',
    color: 'text-warning border-warning',
  },
  cyan: {
    selected: 'text-info border-info',
    deselected: 'text-info',
    color: 'text-info border-info',
  },
};

export const Icons = {
  plus: PlusIcon,
  frown: FrownIcon,
  meh: MehIcon,
  smile: SmileIcon,
  thumbsup: ThumbsUpIcon,
  thumbsdown: ThumbsDownIcon,
  minuscircle: MinusCircleIcon,
  pluscircle: PlusCircleIcon,
  star: StarIcon,
  delete: DeleteIcon,
  trendingup: TrendingUpIcon,
  heart: HeartIcon,
  download: DownloadIcon,
  ellispses: MoreHorizontalIcon,
  close: XIcon,
  github: GithubIcon
};

export const BoardTemplates = {
  madSadGlad: {
    name: 'Mad, Sad, Glad',
    ranks: [
      {
        name: 'mad',
        icon: 'frown',
        color: 'red',
      },
      {
        name: 'sad',
        icon: 'meh',
        color: 'blue',
      },
      {
        name: 'glad',
        icon: 'smile',
        color: 'green',
      },
    ],
  },
  wellNotWellLacking: {
    name: "Went well, Didn't go well, Lacking",
    ranks: [
      {
        name: 'went well',
        icon: 'thumbsup',
        color: 'green',
      },
      {
        name: "didn't go well",
        icon: 'thumbsdown',
        color: 'blue',
      },
      {
        name: 'lacking',
        icon: 'minuscircle',
        color: 'red',
      },
    ],
  },
  dropAddKeepImprove: {
    name: 'Drop, Add, Keep, Improve',
    ranks: [
      {
        name: 'drop',
        icon: 'delete',
        color: 'red',
      },
      {
        name: 'add',
        icon: 'pluscircle',
        color: 'green',
      },
      {
        name: 'keep',
        icon: 'star',
        color: 'blue',
      },
      {
        name: 'improve',
        icon: 'trendingup',
        color: 'yellow',
      },
    ],
  },
  likedLovedLacked: {
    name: 'Liked, Loved, Lacked',
    ranks: [
      {
        name: 'liked',
        icon: 'thumbsup',
        color: 'green',
      },
      {
        name: 'loved',
        icon: 'heart',
        color: 'red',
      },
      {
        name: 'lacked',
        icon: 'thumbsdown',
        color: 'cyan',
      },
    ],
  },
};

export function getRankDetails(rank) {
  return {
    icon: Icons[rank.data.icon],
    classes: Colors[rank.data.color],
  };
}
