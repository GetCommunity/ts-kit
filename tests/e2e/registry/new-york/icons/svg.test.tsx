import { render, screen } from "@solidjs/testing-library"
import type { Component, ComponentProps } from "solid-js"
import AppleIcon, { apple } from "@/registry/new-york/icons/svg/apple"
import ArchiveIcon, { archive } from "@/registry/new-york/icons/svg/archive"
import AriaIcon, { aria } from "@/registry/new-york/icons/svg/aria"
import ArrowLeftIcon, { arrowLeft } from "@/registry/new-york/icons/svg/arrow-left"
import ArrowRightIcon, { arrowRight } from "@/registry/new-york/icons/svg/arrow-right"
import AssociateIcon, { associate } from "@/registry/new-york/icons/svg/associate"
import CaretDownIcon, { caretDown } from "@/registry/new-york/icons/svg/caret-down"
import CaretLeftIcon, { caretLeft } from "@/registry/new-york/icons/svg/caret-left"
import CaretRightIcon, { caretRight } from "@/registry/new-york/icons/svg/caret-right"
import CaretSortIcon, { caretSort } from "@/registry/new-york/icons/svg/caret-sort"
import CaretUpIcon, { caretUp } from "@/registry/new-york/icons/svg/caret-up"
import CheckIcon, { check } from "@/registry/new-york/icons/svg/check"
import CheckboxIcon, { checkbox } from "@/registry/new-york/icons/svg/checkbox"
import CheckBoxCheckedIcon, {
  checkBoxChecked
} from "@/registry/new-york/icons/svg/checkbox-checked"
import CheckBoxIndeterminateIcon, {
  checkBoxIndeterminate
} from "@/registry/new-york/icons/svg/checkbox-indeterminate"
import CheckboxMinusIcon, {
  checkboxMinus
} from "@/registry/new-york/icons/svg/checkbox-minus"
import CheckBoxUncheckedIcon, {
  checkBoxUnchecked
} from "@/registry/new-york/icons/svg/checkbox-unchecked"
import ChevronDoubleLeftIcon, {
  chevronDoubleLeft
} from "@/registry/new-york/icons/svg/chevron-double-left"
import ChevronDoubleRightIcon, {
  chevronDoubleRight
} from "@/registry/new-york/icons/svg/chevron-double-right"
import ChevronLeftIcon, {
  chevronLeft
} from "@/registry/new-york/icons/svg/chevron-left"
import ChevronRightIcon, {
  chevronRight
} from "@/registry/new-york/icons/svg/chevron-right"
import CircleFillIcon, { circleFill } from "@/registry/new-york/icons/svg/circle-fill"
import CircleOutlineIcon, {
  circleOutline
} from "@/registry/new-york/icons/svg/circle-outline"
import ClipboardIcon, { clipboard } from "@/registry/new-york/icons/svg/clipboard"
import CloseIcon, { close } from "@/registry/new-york/icons/svg/close"
import ColumnsIcon, { columns } from "@/registry/new-york/icons/svg/columns"
import CookieIcon, { cookie } from "@/registry/new-york/icons/svg/cookie"
import CreateIcon, { create } from "@/registry/new-york/icons/svg/create"
import DeleteIconElm, { deleteIcon } from "@/registry/new-york/icons/svg/delete"
import DisassociateIcon, {
  disassociate
} from "@/registry/new-york/icons/svg/disassociate"
import DownloadIcon, { download } from "@/registry/new-york/icons/svg/download"
import DraggableIcon, { draggable } from "@/registry/new-york/icons/svg/draggable"
import DuplicateIcon, { duplicate } from "@/registry/new-york/icons/svg/duplicate"
import EmailIcon, { email } from "@/registry/new-york/icons/svg/email"
import FacebookIcon, { facebook } from "@/registry/new-york/icons/svg/facebook"
import FilterIcon, { filter } from "@/registry/new-york/icons/svg/filter"
import GetcommunityIcon, {
  getcommunity
} from "@/registry/new-york/icons/svg/getcommunity"
import GithubIcon, { github } from "@/registry/new-york/icons/svg/github"
import GoogleIcon, { google } from "@/registry/new-york/icons/svg/google"
import HeartFillIcon, { heartFill } from "@/registry/new-york/icons/svg/heart-fill"
import HeartOutlineIcon, {
  heartOutline
} from "@/registry/new-york/icons/svg/heart-outline"
import HelpIcon, { help } from "@/registry/new-york/icons/svg/help"
import InfoIcon, { info } from "@/registry/new-york/icons/svg/info"
import InstagramIcon, { instagram } from "@/registry/new-york/icons/svg/instagram"
import LaptopIcon, { laptop } from "@/registry/new-york/icons/svg/laptop"
import LinkIcon, { link } from "@/registry/new-york/icons/svg/link"
import LinkedinIcon, { linkedin } from "@/registry/new-york/icons/svg/linkedin"
import LoginIcon, { login } from "@/registry/new-york/icons/svg/login"
import LogoIcon, { logo } from "@/registry/new-york/icons/svg/logo"
import LogoutIcon, { logout } from "@/registry/new-york/icons/svg/logout"
import MenuOpenIcon, { menuOpen } from "@/registry/new-york/icons/svg/menu-open"
import MenuOpenFullIcon, {
  menuOpenFull
} from "@/registry/new-york/icons/svg/menu-open-full"
import MoonIcon, { moon } from "@/registry/new-york/icons/svg/moon"
import PauseCircleFillIcon, {
  pauseCircleFill
} from "@/registry/new-york/icons/svg/pause-circle-fill"
import PauseCircleOutlineIcon, {
  pauseCircleOutline
} from "@/registry/new-york/icons/svg/pause-circle-outline"
import PersonIcon, { person } from "@/registry/new-york/icons/svg/person"
import PhoneIcon, { phone } from "@/registry/new-york/icons/svg/phone"
import PinterestIcon, { pinterest } from "@/registry/new-york/icons/svg/pinterest"
import PlayCircleFillIcon, {
  playCircleFill
} from "@/registry/new-york/icons/svg/play-circle-fill"
import PlayCircleOutlineIcon, {
  playCircleOutline
} from "@/registry/new-york/icons/svg/play-circle-outline"
import ProcessIcon, { process } from "@/registry/new-york/icons/svg/process"
import ProfileIcon, { profile } from "@/registry/new-york/icons/svg/profile"
import ReadIcon, { read } from "@/registry/new-york/icons/svg/read"
import ResetIcon, { reset } from "@/registry/new-york/icons/svg/reset"
import SaveIcon, { save } from "@/registry/new-york/icons/svg/save"
import SaveAllIcon, { saveAll } from "@/registry/new-york/icons/svg/save-all"
import SearchIcon, { search } from "@/registry/new-york/icons/svg/search"
import SettingsIcon, { settings } from "@/registry/new-york/icons/svg/settings"
import ShareIcon, { share } from "@/registry/new-york/icons/svg/share"
import SidebarOpenIcon, {
  sidebarOpen
} from "@/registry/new-york/icons/svg/sidebar-open"
import SpinnerIcon, { spinner } from "@/registry/new-york/icons/svg/spinner"
import SunIcon, { sun } from "@/registry/new-york/icons/svg/sun"
import TailwindIcon, { tailwind } from "@/registry/new-york/icons/svg/tailwind"
import TiktokIcon, { tiktok } from "@/registry/new-york/icons/svg/tiktok"
import TwitterIcon, { twitter } from "@/registry/new-york/icons/svg/twitter"
import UnreadIcon, { unread } from "@/registry/new-york/icons/svg/unread"
import UpdateIcon, { update } from "@/registry/new-york/icons/svg/update"
import YoutubeIcon, { youtube } from "@/registry/new-york/icons/svg/youtube"

const iconModules = [
  {
    fileName: "apple.tsx",
    exportName: "apple",
    Icon: apple,
    IconElm: AppleIcon
  },
  {
    fileName: "archive.tsx",
    exportName: "archive",
    Icon: archive,
    IconElm: ArchiveIcon
  },
  { fileName: "aria.tsx", exportName: "aria", Icon: aria, IconElm: AriaIcon },
  {
    fileName: "arrowLeft.tsx",
    exportName: "arrowLeft",
    Icon: arrowLeft,
    IconElm: ArrowLeftIcon
  },
  {
    fileName: "arrowRight.tsx",
    exportName: "arrowRight",
    Icon: arrowRight,
    IconElm: ArrowRightIcon
  },
  {
    fileName: "associate.tsx",
    exportName: "associate",
    Icon: associate,
    IconElm: AssociateIcon
  },
  {
    fileName: "caretDown.tsx",
    exportName: "caretDown",
    Icon: caretDown,
    IconElm: CaretDownIcon
  },
  {
    fileName: "caretLeft.tsx",
    exportName: "caretLeft",
    Icon: caretLeft,
    IconElm: CaretLeftIcon
  },
  {
    fileName: "caretRight.tsx",
    exportName: "caretRight",
    Icon: caretRight,
    IconElm: CaretRightIcon
  },
  {
    fileName: "caretSort.tsx",
    exportName: "caretSort",
    Icon: caretSort,
    IconElm: CaretSortIcon
  },
  {
    fileName: "caretUp.tsx",
    exportName: "caretUp",
    Icon: caretUp,
    IconElm: CaretUpIcon
  },
  {
    fileName: "check.tsx",
    exportName: "check",
    Icon: check,
    IconElm: CheckIcon
  },
  {
    fileName: "checkBoxChecked.tsx",
    exportName: "checkBoxChecked",
    Icon: checkBoxChecked,
    IconElm: CheckBoxCheckedIcon
  },
  {
    fileName: "checkBoxIndeterminate.tsx",
    exportName: "checkBoxIndeterminate",
    Icon: checkBoxIndeterminate,
    IconElm: CheckBoxIndeterminateIcon
  },
  {
    fileName: "checkBoxUnchecked.tsx",
    exportName: "checkBoxUnchecked",
    Icon: checkBoxUnchecked,
    IconElm: CheckBoxUncheckedIcon
  },
  {
    fileName: "checkbox.tsx",
    exportName: "checkbox",
    Icon: checkbox,
    IconElm: CheckboxIcon
  },
  {
    fileName: "checkboxMinus.tsx",
    exportName: "checkboxMinus",
    Icon: checkboxMinus,
    IconElm: CheckboxMinusIcon
  },
  {
    fileName: "chevronDoubleLeft.tsx",
    exportName: "chevronDoubleLeft",
    Icon: chevronDoubleLeft,
    IconElm: ChevronDoubleLeftIcon
  },
  {
    fileName: "chevronDoubleRight.tsx",
    exportName: "chevronDoubleRight",
    Icon: chevronDoubleRight,
    IconElm: ChevronDoubleRightIcon
  },
  {
    fileName: "chevronLeft.tsx",
    exportName: "chevronLeft",
    Icon: chevronLeft,
    IconElm: ChevronLeftIcon
  },
  {
    fileName: "chevronRight.tsx",
    exportName: "chevronRight",
    Icon: chevronRight,
    IconElm: ChevronRightIcon
  },
  {
    fileName: "circleFill.tsx",
    exportName: "circleFill",
    Icon: circleFill,
    IconElm: CircleFillIcon
  },
  {
    fileName: "circleOutline.tsx",
    exportName: "circleOutline",
    Icon: circleOutline,
    IconElm: CircleOutlineIcon
  },
  {
    fileName: "clipboard.tsx",
    exportName: "clipboard",
    Icon: clipboard,
    IconElm: ClipboardIcon
  },
  {
    fileName: "close.tsx",
    exportName: "close",
    Icon: close,
    IconElm: CloseIcon
  },
  {
    fileName: "columns.tsx",
    exportName: "columns",
    Icon: columns,
    IconElm: ColumnsIcon
  },
  {
    fileName: "cookie.tsx",
    exportName: "cookie",
    Icon: cookie,
    IconElm: CookieIcon
  },
  {
    fileName: "create.tsx",
    exportName: "create",
    Icon: create,
    IconElm: CreateIcon
  },
  {
    fileName: "delete.tsx",
    exportName: "deleteIcon",
    Icon: deleteIcon,
    IconElm: DeleteIconElm
  },
  {
    fileName: "disassociate.tsx",
    exportName: "disassociate",
    Icon: disassociate,
    IconElm: DisassociateIcon
  },
  {
    fileName: "download.tsx",
    exportName: "download",
    Icon: download,
    IconElm: DownloadIcon
  },
  {
    fileName: "draggable.tsx",
    exportName: "draggable",
    Icon: draggable,
    IconElm: DraggableIcon
  },
  {
    fileName: "duplicate.tsx",
    exportName: "duplicate",
    Icon: duplicate,
    IconElm: DuplicateIcon
  },
  {
    fileName: "email.tsx",
    exportName: "email",
    Icon: email,
    IconElm: EmailIcon
  },
  {
    fileName: "facebook.tsx",
    exportName: "facebook",
    Icon: facebook,
    IconElm: FacebookIcon
  },
  {
    fileName: "filter.tsx",
    exportName: "filter",
    Icon: filter,
    IconElm: FilterIcon
  },
  {
    fileName: "getcommunity.tsx",
    exportName: "getcommunity",
    Icon: getcommunity,
    IconElm: GetcommunityIcon
  },
  {
    fileName: "github.tsx",
    exportName: "github",
    Icon: github,
    IconElm: GithubIcon
  },
  {
    fileName: "google.tsx",
    exportName: "google",
    Icon: google,
    IconElm: GoogleIcon
  },
  {
    fileName: "heartFill.tsx",
    exportName: "heartFill",
    Icon: heartFill,
    IconElm: HeartFillIcon
  },
  {
    fileName: "heartOutline.tsx",
    exportName: "heartOutline",
    Icon: heartOutline,
    IconElm: HeartOutlineIcon
  },
  { fileName: "help.tsx", exportName: "help", Icon: help, IconElm: HelpIcon },
  { fileName: "info.tsx", exportName: "info", Icon: info, IconElm: InfoIcon },
  {
    fileName: "instagram.tsx",
    exportName: "instagram",
    Icon: instagram,
    IconElm: InstagramIcon
  },
  {
    fileName: "laptop.tsx",
    exportName: "laptop",
    Icon: laptop,
    IconElm: LaptopIcon
  },
  { fileName: "link.tsx", exportName: "link", Icon: link, IconElm: LinkIcon },
  {
    fileName: "linkedin.tsx",
    exportName: "linkedin",
    Icon: linkedin,
    IconElm: LinkedinIcon
  },
  {
    fileName: "login.tsx",
    exportName: "login",
    Icon: login,
    IconElm: LoginIcon
  },
  { fileName: "logo.tsx", exportName: "logo", Icon: logo, IconElm: LogoIcon },
  {
    fileName: "logout.tsx",
    exportName: "logout",
    Icon: logout,
    IconElm: LogoutIcon
  },
  {
    fileName: "menuOpen.tsx",
    exportName: "menuOpen",
    Icon: menuOpen,
    IconElm: MenuOpenIcon
  },
  {
    fileName: "menuOpenFull.tsx",
    exportName: "menuOpenFull",
    Icon: menuOpenFull,
    IconElm: MenuOpenFullIcon
  },
  { fileName: "moon.tsx", exportName: "moon", Icon: moon, IconElm: MoonIcon },
  {
    fileName: "pauseCircleFill.tsx",
    exportName: "pauseCircleFill",
    Icon: pauseCircleFill,
    IconElm: PauseCircleFillIcon
  },
  {
    fileName: "pauseCircleOutline.tsx",
    exportName: "pauseCircleOutline",
    Icon: pauseCircleOutline,
    IconElm: PauseCircleOutlineIcon
  },
  {
    fileName: "person.tsx",
    exportName: "person",
    Icon: person,
    IconElm: PersonIcon
  },
  {
    fileName: "phone.tsx",
    exportName: "phone",
    Icon: phone,
    IconElm: PhoneIcon
  },
  {
    fileName: "pinterest.tsx",
    exportName: "pinterest",
    Icon: pinterest,
    IconElm: PinterestIcon
  },
  {
    fileName: "playCircleFill.tsx",
    exportName: "playCircleFill",
    Icon: playCircleFill,
    IconElm: PlayCircleFillIcon
  },
  {
    fileName: "playCircleOutline.tsx",
    exportName: "playCircleOutline",
    Icon: playCircleOutline,
    IconElm: PlayCircleOutlineIcon
  },
  {
    fileName: "process.tsx",
    exportName: "process",
    Icon: process,
    IconElm: ProcessIcon
  },
  {
    fileName: "profile.tsx",
    exportName: "profile",
    Icon: profile,
    IconElm: ProfileIcon
  },
  { fileName: "read.tsx", exportName: "read", Icon: read, IconElm: ReadIcon },
  { fileName: "reset.tsx", exportName: "reset", Icon: reset, IconElm: ResetIcon },
  { fileName: "save.tsx", exportName: "save", Icon: save, IconElm: SaveIcon },
  {
    fileName: "saveAll.tsx",
    exportName: "saveAll",
    Icon: saveAll,
    IconElm: SaveAllIcon
  },
  {
    fileName: "search.tsx",
    exportName: "search",
    Icon: search,
    IconElm: SearchIcon
  },
  {
    fileName: "settings.tsx",
    exportName: "settings",
    Icon: settings,
    IconElm: SettingsIcon
  },
  {
    fileName: "share.tsx",
    exportName: "share",
    Icon: share,
    IconElm: ShareIcon
  },
  {
    fileName: "sidebarOpen.tsx",
    exportName: "sidebarOpen",
    Icon: sidebarOpen,
    IconElm: SidebarOpenIcon
  },
  {
    fileName: "spinner.tsx",
    exportName: "spinner",
    Icon: spinner,
    IconElm: SpinnerIcon
  },
  { fileName: "sun.tsx", exportName: "sun", Icon: sun, IconElm: SunIcon },
  {
    fileName: "tailwind.tsx",
    exportName: "tailwind",
    Icon: tailwind,
    IconElm: TailwindIcon
  },
  {
    fileName: "tiktok.tsx",
    exportName: "tiktok",
    Icon: tiktok,
    IconElm: TiktokIcon
  },
  {
    fileName: "twitter.tsx",
    exportName: "twitter",
    Icon: twitter,
    IconElm: TwitterIcon
  },
  {
    fileName: "unread.tsx",
    exportName: "unread",
    Icon: unread,
    IconElm: UnreadIcon
  },
  {
    fileName: "update.tsx",
    exportName: "update",
    Icon: update,
    IconElm: UpdateIcon
  },
  {
    fileName: "youtube.tsx",
    exportName: "youtube",
    Icon: youtube,
    IconElm: YoutubeIcon
  }
] satisfies Array<{
  fileName: string
  exportName: string
  Icon: Component<ComponentProps<"svg">>
  IconElm: Component<ComponentProps<"svg">>
}>

describe("SVG icon components", () => {
  it.each(iconModules)(
    "renders $fileName named and Icon exports as prop-forwarding SVGs",
    ({ exportName, Icon, IconElm }) => {
      expect(IconElm).toBe(Icon)

      render(() => (
        <Icon
          aria-label={`${exportName} icon`}
          class="custom-icon"
          data-testid={`${exportName}-icon`}
        />
      ))

      const svg = screen.getByTestId(`${exportName}-icon`)

      expect(svg.tagName.toLowerCase()).toBe("svg")
      expect(svg).toHaveClass("custom-icon")
      expect(svg).toHaveAccessibleName(`${exportName} icon`)
      expect(svg.children.length).toBeGreaterThan(0)
    }
  )
})
