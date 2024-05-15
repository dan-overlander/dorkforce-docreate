import { accordion } from "./scripts/components/accordion";
import { actionMenu } from "./scripts/components/action-menu";
import { actionMenuItem } from "./scripts/components/action-menu-item";
import { badge } from "./scripts/components/badge";
import { blockquote } from "./scripts/components/blockquote";
import { breadcrumb } from "./scripts/components/breadcrumb";
import { button } from "./scripts/components/button";
import { card } from "./scripts/components/card";
import { carousel } from "./scripts/components/carousel";
import { carouselItem } from "./scripts/components/carousel-item";
import { checkbox } from "./scripts/components/checkbox";
import { datePicker } from "./scripts/components/date-picker";
import { doAdd } from "./scripts/do-add";
import { doClass } from "./scripts/do-class";
import { doElement } from "./scripts/do-element";
import { doId } from "./scripts/do-id";
import { doObserve } from "./scripts/do-observe";
import { doRandom } from "./scripts/do-random";
import { doXhr } from "./scripts/do-xhr";
import { drawer } from "./scripts/components/drawer";
import { dropdown } from "./scripts/components/dropdown";
import { dropdownItem } from "./scripts/components/dropdown-item";
import { fieldset } from "./scripts/components/fieldset";
import { fileInput } from "./scripts/components/file-input";
import { footnote } from "./scripts/components/footnote";
import { form } from "./scripts/components/form";
import { icon } from "./scripts/components/icon";
import { iconDef } from "./scripts/components/icon-def";
import { inputMask } from "./scripts/components/input-mask";
import { inputPassword } from "./scripts/components/input-password";
import { link } from "./scripts/components/link";
import { list } from "./scripts/components/list";
import { loadingIndicator } from "./scripts/components/loading-indicator";
import { messageBar } from "./scripts/components/message-bar";
import { modal } from "./scripts/components/modal";
import { moreLess } from "./scripts/components/more-less";
import { notification } from "./scripts/components/notification";
import { pagination } from "./scripts/components/pagination";
import { popover } from "./scripts/components/popover";
import { progressBar } from "./scripts/components/progress-bar";
import { progressTracker } from "./scripts/components/progress-tracker";
import { progressTrackerItem } from "./scripts/components/progress-tracker-item";
import { radioButton } from "./scripts/components/radio-button";
import { search } from "./scripts/components/search";
import { select } from "./scripts/components/select";
import { sideNav } from "./scripts/components/side-nav";
import { switchClass } from "./scripts/components/switch";
import { table } from "./scripts/components/table";
import { tabs } from "./scripts/components/tabs";
import { tabsItem } from "./scripts/components/tabs-item";
import { tag } from "./scripts/components/tag";
import { textArea } from "./scripts/components/text-area";
import { textInput } from "./scripts/components/text-input";
import { timePicker } from "./scripts/components/time-picker";
import { tooltip } from "./scripts/components/tooltip";

const DCR = {
    accordion,
    actionMenu,
    actionMenuItem,
    add: doAdd,
    badge,
    blockquote,
    breadcrumb,
    button,
    card,
    carousel,
    carouselItem,
    checkbox,
    class: doClass,
    datePicker,
    drawer,
    dropdown,
    dropdownItem,
    element: doElement,
    fieldset,
    fileInput,
    footnote,
    form,
    icon,
    iconDef,
    id: doId,
    inputMask,
    inputPassword,
    link,
    list,
    loadingIndicator,
    messageBar,
    modal,
    moreLess,
    notification,
    observe: doObserve,
    pagination,
    popover,
    progressBar,
    progressTracker,
    progressTrackerItem,
    radioButton,
    random: doRandom,
    search,
    select,
    sideNav,
    switch: switchClass,
    table,
    tabs,
    tabsItem,
    tag,
    textArea,
    textInput,
    timePicker,
    tooltip,
    xhr: doXhr,
};

// Modify add method to pass DCR itself
DCR.add = DCR.add.bind(null, DCR);

export default DCR;
