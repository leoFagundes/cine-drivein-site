"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import {
  IoClose,
  IoSearchOutline,
  IoArrowBack,
  IoRestaurantOutline,
} from "react-icons/io5";
import { FiStar, FiTag } from "react-icons/fi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subitem {
  id: string;
  name: string;
  description: string;
  photo?: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  value: number;
  visibleValue?: number;
  photo?: string;
  isFeatured: boolean;
  isPromotion: boolean;
  promotionOriginalPrice?: number;
  additionals: string[];
  additionals_sauce: string[];
  additionals_drink: string[];
  additionals_sweet: string[];
}

const ADDL_GROUPS: {
  key: keyof Pick<
    MenuItem,
    | "additionals"
    | "additionals_sauce"
    | "additionals_drink"
    | "additionals_sweet"
  >;
  label: string;
  emoji: string;
}[] = [
  { key: "additionals", label: "Acompanhamentos", emoji: "🍽️" },
  { key: "additionals_sauce", label: "Molho", emoji: "🫙" },
  { key: "additionals_drink", label: "Bebida", emoji: "🥤" },
  { key: "additionals_sweet", label: "Sobremesa", emoji: "🍰" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function sortItems(list: MenuItem[]) {
  return [...list].sort((a, b) => {
    const score = (i: MenuItem) => (i.isPromotion ? 2 : i.isFeatured ? 1 : 0);
    return score(b) - score(a);
  });
}

// ─── Item Card ────────────────────────────────────────────────────────────────

function ItemCard({ item, onClick }: { item: MenuItem; onClick: () => void }) {
  const price = item.visibleValue ?? item.value;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white shadow-sm border border-stone-100 hover:shadow-md hover:border-stone-200 active:scale-[0.98] transition-all duration-150 text-left cursor-pointer"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.isPromotion && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5 py-0.5 leading-none">
              <FiTag size={9} />
              PROMO
            </span>
          )}
          {item.isFeatured && !item.isPromotion && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 rounded-full px-1.5 py-0.5 leading-none">
              <FiStar size={9} />
              DESTAQUE
            </span>
          )}
          <p className="text-sm font-bold text-stone-800 leading-tight line-clamp-1">
            {item.name}
          </p>
        </div>
        {item.description && (
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {formatPrice(price)}
          </span>
          {item.isPromotion && item.promotionOriginalPrice && (
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(item.promotionOriginalPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
        {item.photo && !imgError ? (
          <img
            src={item.photo}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🍿
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

const detailVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 32 },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { type: "tween" as const, duration: 0.26, ease: "easeIn" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function ItemDetail({
  item,
  onBack,
  onClose,
}: {
  item: MenuItem;
  onBack: () => void;
  onClose: () => void;
}) {
  const price = item.visibleValue ?? item.value;
  const [imgError, setImgError] = useState(false);
  const [subitems, setSubitems] = useState<Subitem[]>(_subs?.subitems ?? []);

  useEffect(() => {
    if (subsFresh()) {
      setSubitems(_subs!.subitems);
      return;
    }
    let cancelled = false;
    getDocs(collection(db, "subitems"))
      .then((snap) => {
        if (cancelled) return;
        const fetched: Subitem[] = snap.docs
          .filter((d) => d.data().isVisible !== false)
          .map((d) => ({
            id: d.id,
            name: d.data().name ?? "",
            description: d.data().description ?? "",
            photo: d.data().photo,
          }));
        _subs = { subitems: fetched, fetchedAt: Date.now() };
        setSubitems(fetched);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = ADDL_GROUPS.map(({ key, label, emoji }) => {
    const ids = item[key] as string[];
    const options = ids
      .map((id) => subitems.find((s) => s.id === id))
      .filter(
        (s): s is Subitem => !!s && s.name.trim().toLowerCase() !== "nada",
      );
    return { label, emoji, options };
  }).filter((g) => g.options.length > 0);

  return (
    <motion.div
      key="detail"
      variants={detailVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 z-10 flex flex-col bg-white rounded-t-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 border-b border-stone-100">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer flex-shrink-0"
        >
          <IoArrowBack size={18} />
        </button>
        <p className="flex-1 text-sm font-bold text-stone-800 line-clamp-1">
          {item.name}
        </p>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer flex-shrink-0"
        >
          <IoClose size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Hero image */}
        <div
          className="w-full bg-stone-100 flex-shrink-0 overflow-hidden"
          style={{ height: "min(56vw, 260px)" }}
        >
          {item.photo && !imgError ? (
            <motion.img
              src={item.photo}
              alt={item.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-stone-50">
              <IoRestaurantOutline size={48} className="text-stone-300" />
              <p className="text-xs text-stone-400 font-medium">Sem foto</p>
            </div>
          )}
        </div>

        {/* Content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="px-5 py-5 flex flex-col gap-4"
        >
          {/* Badges + Name + Price */}
          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-stone-400 bg-stone-100 rounded-full px-2.5 py-0.5">
                {item.category}
              </span>
              {item.isPromotion && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-red-500 rounded-full px-2.5 py-0.5">
                  <FiTag size={10} />
                  PROMOÇÃO
                </span>
              )}
              {item.isFeatured && !item.isPromotion && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-full px-2.5 py-0.5">
                  <FiStar size={10} />
                  DESTAQUE
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-stone-800 leading-tight">
              {item.name}
            </h2>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[var(--color-primary)]">
                {formatPrice(price)}
              </span>
              {item.isPromotion && item.promotionOriginalPrice && (
                <span className="text-base text-stone-400 line-through">
                  {formatPrice(item.promotionOriginalPrice)}
                </span>
              )}
            </div>
          </motion.div>

          {/* Description */}
          {item.description && (
            <motion.div variants={fadeUp}>
              <p className="text-sm text-stone-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          )}

          {/* Additionals */}
          {groups.length > 0 && (
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="h-px bg-stone-100" />
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Acompanha / opções
              </p>

              {groups.map(({ label, emoji, options }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{emoji}</span>
                    <h3 className="text-sm font-bold text-stone-700">
                      {label}
                    </h3>
                    <div className="flex-1 h-px bg-stone-100" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {options.map((sub) => (
                      <SubitemRow key={sub.id} sub={sub} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {groups.length === 0 && !item.description && (
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center py-6 gap-2 text-stone-300"
            >
              <IoRestaurantOutline size={32} />
              <p className="text-sm font-medium">Sem informações adicionais</p>
            </motion.div>
          )}

          <div className="h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function SubitemRow({ sub }: { sub: Subitem }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
        {sub.photo && !imgError ? (
          <img
            src={sub.photo}
            alt={sub.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            🍽️
          </div>
        )}
      </div>
      <p className="flex-1 min-w-0 text-sm font-semibold text-stone-700 leading-tight truncate">
        {sub.name}
      </p>
    </div>
  );
}

// ─── Module-level cache ───────────────────────────────────────────────────────

const CACHE_TTL = 5 * 60 * 1000;

interface MenuCache {
  items: MenuItem[];
  categories: string[];
  fetchedAt: number;
}
interface SubCache {
  subitems: Subitem[];
  fetchedAt: number;
}

let _menu: MenuCache | null = null;
let _subs: SubCache | null = null;

const menuFresh = () => !!_menu && Date.now() - _menu.fetchedAt < CACHE_TTL;
const subsFresh = () => !!_subs && Date.now() - _subs.fetchedAt < CACHE_TTL;

// ─── Main Modal ───────────────────────────────────────────────────────────────

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { type: "spring" as const, stiffness: 280, damping: 30 },
  },
  exit: {
    y: "100%",
    transition: { type: "tween" as const, duration: 0.28, ease: "easeIn" },
  },
};

interface CardapioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CardapioModal({ isOpen, onClose }: CardapioModalProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tudo");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function load() {
      // Serve from cache instantly when fresh
      if (menuFresh()) {
        setItems(_menu!.items);
        setCategories(_menu!.categories);
        setActiveCategory("Tudo");
        setSelectedItem(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [itemsSnap, orderSnap] = await Promise.all([
          getDocs(
            query(collection(db, "items"), where("isVisible", "==", true)),
          ),
          getDoc(doc(db, "stockConfig", "categoryOrder")),
        ]);

        if (cancelled) return;

        const fetchedItems: MenuItem[] = itemsSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name ?? "",
            category: data.category ?? "",
            description: data.description ?? "",
            value: data.value ?? 0,
            visibleValue: data.visibleValue,
            photo: data.photo,
            isFeatured: data.isFeatured ?? false,
            isPromotion: data.isPromotion ?? false,
            promotionOriginalPrice: data.promotionOriginalPrice,
            additionals: data.additionals ?? [],
            additionals_sauce: data.additionals_sauce ?? [],
            additionals_drink: data.additionals_drink ?? [],
            additionals_sweet: data.additionals_sweet ?? [],
          };
        });

        const orderedCats: string[] = orderSnap.exists()
          ? ((orderSnap.data().categories as string[]) ?? [])
          : [];
        const discovered = Array.from(
          new Set(fetchedItems.map((i) => i.category)),
        ).filter((c) => c && !orderedCats.includes(c));
        const allCats = [...orderedCats, ...discovered].filter((c) =>
          fetchedItems.some((i) => i.category === c),
        );

        _menu = {
          items: fetchedItems,
          categories: allCats,
          fetchedAt: Date.now(),
        };

        setItems(fetchedItems);
        setCategories(allCats);
        setActiveCategory("Tudo");
        setSelectedItem(null);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedItem) setSelectedItem(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, selectedItem]);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filtered = (() => {
    let base =
      activeCategory === "Tudo"
        ? items
        : items.filter((i) => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    return sortItems(base);
  })();

  const tabs = ["Tudo", ...categories];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px]"
            onClick={() => {
              if (selectedItem) setSelectedItem(null);
              else onClose();
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-[#f5f6fa] rounded-t-3xl shadow-2xl overflow-hidden mx-auto w-full max-w-lg lg:rounded-3xl lg:bottom-6"
            style={{ height: "85dvh", maxHeight: "92dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-stone-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-3 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-stone-800">Cardápio</h2>
                <p className="text-xs text-stone-400 font-medium">
                  {loading
                    ? "Carregando..."
                    : `${items.length} iten${items.length !== 1 ? "s" : ""} disponíveis`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors cursor-pointer"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-stone-200">
                <IoSearchOutline
                  size={16}
                  className="text-stone-400 flex-shrink-0"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar no cardápio..."
                  className="flex-1 text-sm text-stone-700 placeholder:text-stone-400 outline-none bg-transparent"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <IoClose size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 px-5 pb-3 overflow-x-auto flex-shrink-0">
              {tabs.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    ref={isActive ? activeTabRef : null}
                    onClick={() => setActiveCategory(cat)}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: isActive
                        ? "var(--color-primary)"
                        : "white",
                      color: isActive ? "white" : "#6b7280",
                      border: isActive ? "none" : "1px solid #e5e7eb",
                      boxShadow: isActive
                        ? "0 2px 8px rgba(0,136,194,0.3)"
                        : "none",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 pb-8 mt-4 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-[var(--color-primary)]"
                      />
                      <p className="text-sm text-stone-400 font-medium">
                        Carregando cardápio...
                      </p>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                      <span className="text-4xl">🔍</span>
                      <p className="text-stone-500 font-semibold text-sm">
                        Nenhum item encontrado
                      </p>
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="text-xs text-[var(--color-primary)] font-medium underline cursor-pointer"
                        >
                          Limpar busca
                        </button>
                      )}
                    </div>
                  ) : activeCategory === "Tudo" && !search.trim() ? (
                    categories.map((cat) => {
                      const catItems = sortItems(
                        items.filter((i) => i.category === cat),
                      );
                      if (!catItems.length) return null;
                      return (
                        <div key={cat} className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">
                              {cat}
                            </h3>
                            <div className="flex-1 h-px bg-stone-200" />
                          </div>
                          <div className="flex flex-col gap-2.5">
                            {catItems.map((item) => (
                              <ItemCard
                                key={item.id}
                                item={item}
                                onClick={() => setSelectedItem(item)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col gap-2.5 pt-1">
                      <AnimatePresence mode="popLayout">
                        {filtered.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Item Detail Panel — filho direto do drawer, cobre tudo */}
            <AnimatePresence>
              {selectedItem && (
                <ItemDetail
                  item={selectedItem}
                  onBack={() => setSelectedItem(null)}
                  onClose={onClose}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
