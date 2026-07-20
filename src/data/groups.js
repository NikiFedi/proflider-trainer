import { FZ7_TESTS } from './fz7_nko.js';
import { FZ82_TESTS } from './fz82_obshestvennye_obyedineniya.js';
import { USTAV_TESTS, SKS_TESTS, FZ10_TESTS } from "./group1_profsoyuz";
import { PROFVZNOSY_TESTS } from "./group1_profvznosy";
import { KRK_POLOJENIE_2025_TESTS } from "./krk_polojenie_2025";
import { PRINCIPY_IMUSHESTVA_2025_TESTS } from "./principy_imushestva_2025";
import { EDU_TESTS } from "./group2_obrazovanie";
import { DORM_TESTS } from "./group3_obshezhitiya";
import { STIPEND_TESTS } from "./group4_stipendii";
import { FZ178_TESTS } from "./group4_fz178";
import { PP1390_TESTS } from "./group4_pp1390";
import { DISC_TESTS } from "./group5_disciplina";
import { ROSMOL_TESTS } from "./rosmolodezh";
import { ROSMOL_FORUMS_TESTS } from "./rosmol_forums";
import { DATES_TESTS } from "./daty";
import { PROFKOM_TESTS } from "./profkom_vshte";
import { MIX_TESTS } from "./proshlye_etapy";

// Чтобы добавить новую группу или тест:
// 1. Создай новый файл src/data/имя_файла.js с export const MY_TESTS = [ {id, title, subtitle, questions:[...]} ];
// 2. Импортируй его здесь.
// 3. Либо добавь его тесты в существующую группу ниже (в массив tests),
//    либо создай новую запись в GROUPS.

export const GROUPS = [
 { id: "g1", n: 1, title: "Группа 1 — Деятельность Профсоюза и СКС Профсоюза", short: "Профсоюз и СКС", tests: [...USTAV_TESTS, ...SKS_TESTS, ...FZ10_TESTS, ...PROFVZNOSY_TESTS, ...KRK_POLOJENIE_2025_TESTS, ...PRINCIPY_IMUSHESTVA_2025_TESTS] },
  { id: "g2", n: 2, title: "Группа 2 — Деятельность в сфере образования", short: "Образование", tests: EDU_TESTS },
  { id: "g3", n: 3, title: "Группа 3 — Деятельность студенческих общежитий", short: "Общежития", tests: DORM_TESTS },
{ id: "g4", n: 4, title: "Группа 4 — Стипендиальное обеспечение", short: "Стипендии", tests: [...STIPEND_TESTS, ...FZ178_TESTS, ...PP1390_TESTS] },
  { id: "g5", n: 5, title: "Группа 5 — Дисциплинарные взыскания", short: "Дисциплинарные", tests: DISC_TESTS },
  { id: "rosmol", n: "🎯", title: "Росмолодёжь — Гранты, номинации, условия конкурса", short: "Росмолодёжь", tests: [...ROSMOL_TESTS, ...ROSMOL_FORUMS_TESTS] },
  { id: "profkom", n: "🏛", title: "Профком ВШТЭ — тесты для подготовки к конкурсу", short: "Профком ВШТЭ", tests: PROFKOM_TESTS },
  { id: "dates", n: "📅", title: "Памятные даты — профсоюзные, студенческие, государственные, ФЗ-32", short: "Даты", tests: DATES_TESTS },
{ id: "mix", n: "★", title: "Прошлые этапы конкурса — сборные тесты по всем темам", short: "Прошлые этапы", tests: MIX_TESTS },
  { id: "molpolitika", n: "🏳", title: "Молодёжная политика — НКО и общественные объединения", short: "Молодёжная политика", tests: [...FZ7_TESTS, ...FZ82_TESTS] },
];
