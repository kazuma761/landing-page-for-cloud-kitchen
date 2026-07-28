"use client"

import type { FormEvent, ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Bike,
  CalendarCheck,
  Check,
  ChefHat,
  Clock3,
  Flame,
  Leaf,
  MapPin,
  Minus,
  Phone,
  Pizza,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Utensils,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type MenuItem = {
  id: string
  name: string
  category: "signature" | "classic" | "sides"
  description: string
  price: number
  veg: boolean
  heat: 0 | 1 | 2
  emoji: string
  accent: string
  tags: string[]
}

type CartItem = MenuItem & {
  quantity: number
}

type BookingMode = "delivery" | "pickup" | "table"

type BookingForm = {
  name: string
  phone: string
  date: string
  time: string
  guests: string
  address: string
  notes: string
}

type Confirmation = {
  id: string
  mode: BookingMode
  total: number
  name: string
  time: string
  date: string
}

const menuItems: MenuItem[] = [
  {
    id: "hsr-firecracker",
    name: "HSR Firecracker Margherita",
    category: "signature",
    description:
      "San Marzano-style tomato sauce, fresh basil, buffalo mozzarella, chilli honey and blistered sourdough crust.",
    price: 349,
    veg: true,
    heat: 1,
    emoji: "🍕",
    accent: "from-red-500 to-orange-400",
    tags: ["Bestseller", "12-inch"],
  },
  {
    id: "koramangala-pepperoni",
    name: "Double Pepperoni Melt",
    category: "signature",
    description:
      "Crisp pepperoni cups, smoked mozzarella, parmesan dust and slow-cooked tomato passata.",
    price: 449,
    veg: false,
    heat: 1,
    emoji: "🔥",
    accent: "from-amber-500 to-red-500",
    tags: ["Loaded", "12-inch"],
  },
  {
    id: "garden-pesto",
    name: "Garden Pesto Burrata",
    category: "signature",
    description:
      "Creamy burrata, basil pesto, roasted cherry tomatoes, zucchini ribbons and toasted pine nuts.",
    price: 429,
    veg: true,
    heat: 0,
    emoji: "🌿",
    accent: "from-emerald-500 to-lime-400",
    tags: ["Fresh", "Chef special"],
  },
  {
    id: "tandoori-paneer",
    name: "Tandoori Paneer Inferno",
    category: "classic",
    description:
      "Charred paneer tikka, onions, peppers, makhani base, mint crema and pickled chillies.",
    price: 399,
    veg: true,
    heat: 2,
    emoji: "🌶️",
    accent: "from-orange-500 to-rose-500",
    tags: ["Spicy", "HSR favourite"],
  },
  {
    id: "bbq-chicken",
    name: "Smoky BBQ Chicken",
    category: "classic",
    description:
      "Pulled chicken, caramelised onions, smoked cheddar, BBQ drizzle and parsley crumb.",
    price: 429,
    veg: false,
    heat: 0,
    emoji: "🍗",
    accent: "from-yellow-600 to-orange-500",
    tags: ["Smoky", "High protein"],
  },
  {
    id: "truffle-fungi",
    name: "Truffle Fungi Bianca",
    category: "classic",
    description:
      "Garlic cream, mixed mushrooms, mozzarella, truffle oil, cracked pepper and rocket leaves.",
    price: 459,
    veg: true,
    heat: 0,
    emoji: "🍄",
    accent: "from-stone-600 to-neutral-400",
    tags: ["White sauce", "Premium"],
  },
  {
    id: "garlic-knots",
    name: "Parmesan Garlic Knots",
    category: "sides",
    description:
      "Eight hand-tied knots tossed in garlic butter, parsley and aged parmesan. Served with marinara.",
    price: 189,
    veg: true,
    heat: 0,
    emoji: "🥨",
    accent: "from-yellow-400 to-amber-500",
    tags: ["Shareable"],
  },
  {
    id: "tiramisu-cup",
    name: "Cold Brew Tiramisu Cup",
    category: "sides",
    description:
      "Mascarpone cream, espresso-soaked sponge, cocoa and a cloud-kitchen friendly sealed cup.",
    price: 219,
    veg: true,
    heat: 0,
    emoji: "☕",
    accent: "from-amber-700 to-stone-500",
    tags: ["Dessert"],
  },
]

const timeSlots = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
]

const stats = [
  { value: "28 min", label: "Average HSR delivery", icon: Bike },
  { value: "4.8/5", label: "Neighbourhood rating", icon: Star },
  { value: "72 hr", label: "Cold-fermented dough", icon: Clock3 },
  { value: "100%", label: "Made after ordering", icon: ShieldCheck },
]

const testimonials = [
  {
    name: "Aditi Rao",
    role: "Sector 2, HSR Layout",
    quote:
      "The crust tastes like a proper pizzeria, not a delivery compromise. Firecracker Margherita is now our Friday ritual.",
  },
  {
    name: "Nikhil Menon",
    role: "Startup founder, 27th Main",
    quote:
      "Booked a tasting table for our team of six. Smooth confirmation, warm service and pizzas came out beautifully timed.",
  },
  {
    name: "Sara Thomas",
    role: "Teacher, Agara",
    quote:
      "Clean packaging, no soggy slices and the tandoori paneer has just the right Bengaluru kick.",
  },
]

const defaultForm: BookingForm = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  address: "",
  notes: "",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function todayForInput() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

function makeOrderId() {
  return `HSR-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-4)}`
}

export function CloudKitchenLanding() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState<MenuItem["category"] | "all">("all")
  const [mode, setMode] = useState<BookingMode>("delivery")
  const [form, setForm] = useState<BookingForm>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm | "cart", string>>>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  useEffect(() => {
    const savedCart = window.localStorage.getItem("slice-yard-hsr-cart")
    const savedForm = window.localStorage.getItem("slice-yard-hsr-form")

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[])
      } catch {
        window.localStorage.removeItem("slice-yard-hsr-cart")
      }
    }

    if (savedForm) {
      try {
        setForm({ ...defaultForm, ...(JSON.parse(savedForm) as Partial<BookingForm>) })
      } catch {
        window.localStorage.removeItem("slice-yard-hsr-form")
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("slice-yard-hsr-cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    window.localStorage.setItem("slice-yard-hsr-form", JSON.stringify(form))
  }, [form])

  const filteredMenu = useMemo(() => {
    if (activeCategory === "all") return menuItems
    return menuItems.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  )
  const packaging = cart.length > 0 ? 29 : 0
  const deliveryFee = mode === "delivery" && cart.length > 0 ? 39 : 0
  const tableDeposit = mode === "table" ? Number(form.guests || 0) * 100 : 0
  const total = subtotal + packaging + deliveryFee + tableDeposit
  const itemCount = cart.reduce((totalItems, item) => totalItems + item.quantity, 0)

  function addToCart(item: MenuItem) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, 12) }
            : cartItem,
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
    setErrors((current) => ({ ...current, cart: undefined }))
  }

  function updateQuantity(id: string, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(id: string) {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  function updateField(field: keyof BookingForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validateForm() {
    const nextErrors: Partial<Record<keyof BookingForm | "cart", string>> = {}
    const cleanPhone = form.phone.replace(/\D/g, "")

    if (!form.name.trim()) nextErrors.name = "Please add the booking name."
    if (cleanPhone.length < 10) nextErrors.phone = "Enter a valid 10-digit mobile number."
    if (!form.date) nextErrors.date = "Choose a date."
    if (!form.time) nextErrors.time = "Choose a time slot."
    if (mode !== "table" && cart.length === 0) nextErrors.cart = "Add at least one pizza or side to place an order."
    if (mode === "delivery" && form.address.trim().length < 12) {
      nextErrors.address = "Add a complete HSR delivery address or landmark."
    }
    if (mode === "table" && Number(form.guests) < 1) {
      nextErrors.guests = "Select the number of guests."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validateForm()) return

    const nextConfirmation: Confirmation = {
      id: makeOrderId(),
      mode,
      total,
      name: form.name.trim(),
      time: form.time,
      date: form.date,
    }

    const savedBookings = window.localStorage.getItem("slice-yard-hsr-bookings")
    let bookings: Confirmation[] = []

    if (savedBookings) {
      try {
        bookings = JSON.parse(savedBookings) as Confirmation[]
      } catch {
        window.localStorage.removeItem("slice-yard-hsr-bookings")
      }
    }

    window.localStorage.setItem(
      "slice-yard-hsr-bookings",
      JSON.stringify([nextConfirmation, ...bookings].slice(0, 8)),
    )
    setConfirmation(nextConfirmation)
    setCart([])
    setForm({ ...defaultForm, name: form.name, phone: form.phone })
    setErrors({})
  }

  const categoryButtons: { label: string; value: MenuItem["category"] | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Signature", value: "signature" },
    { label: "Classics", value: "classic" },
    { label: "Sides & sweets", value: "sides" },
  ]

  return (
    <main className="min-h-screen bg-[#fff8ef] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-orange-200/60 bg-[#fff8ef]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <a href="#top" className="flex items-center gap-3" aria-label="Slice Yard HSR home">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-stone-950 text-xl shadow-lg shadow-orange-900/10">
              🍕
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">Slice Yard HSR</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">Cloud Kitchen</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-semibold text-stone-700 md:flex">
            <a className="transition hover:text-orange-600" href="#menu">Menu</a>
            <a className="transition hover:text-orange-600" href="#story">Kitchen</a>
            <a className="transition hover:text-orange-600" href="#reviews">Reviews</a>
            <a className="transition hover:text-orange-600" href="#booking">Book / Order</a>
          </div>
          <Button asChild className="rounded-full bg-stone-950 text-white hover:bg-stone-800">
            <a href="#booking">
              Order now
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </nav>
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="absolute left-0 top-20 size-72 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute bottom-12 right-0 size-96 rounded-full bg-red-300/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <Badge className="mb-6 border-orange-200 bg-white/80 px-4 py-2 text-orange-700 shadow-sm" variant="outline">
              <MapPin className="size-3.5" />
              Fresh pizza from HSR Layout, Bengaluru
            </Badge>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-stone-950 sm:text-6xl lg:text-7xl">
              Cloud kitchen pizza with a neighbourhood soul.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
              Hand-stretched sourdough pizzas, blistered in a stone-deck oven and dispatched hot across HSR Layout, Agara, Bellandur and Koramangala. Order delivery, schedule pickup, or reserve our tiny chef&apos;s table tasting slot.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-orange-600 px-7 text-white shadow-xl shadow-orange-600/20 hover:bg-orange-700">
                <a href="#booking">
                  Start an order
                  <ShoppingBag className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-stone-300 bg-white/70 px-7 hover:bg-white">
                <a href="#menu">
                  View menu
                  <Pizza className="size-4" />
                </a>
              </Button>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-3xl border border-orange-100 bg-white/70 p-4 shadow-sm backdrop-blur">
                    <Icon className="mb-3 size-5 text-orange-600" />
                    <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                    <div className="mt-1 text-xs font-medium text-stone-500">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative z-10">
            <div className="relative mx-auto aspect-square max-w-xl rounded-[3rem] border border-orange-200 bg-gradient-to-br from-orange-100 via-red-100 to-amber-100 p-5 shadow-2xl shadow-orange-900/15">
              <div className="absolute -left-4 top-12 hidden rounded-3xl bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl">🌿</span>
                  <div>
                    <p className="text-sm font-bold">Basil picked daily</p>
                    <p className="text-xs text-stone-500">Fresh prep at 11 AM</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-3 bottom-12 hidden rounded-3xl bg-stone-950 p-4 text-white shadow-xl sm:block">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-200">Live queue</p>
                <p className="mt-1 text-2xl font-black">14 orders</p>
              </div>
              <div className="grid h-full place-items-center rounded-[2.5rem] bg-white/65 p-7 backdrop-blur-sm">
                <div className="relative aspect-square w-full max-w-sm rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 p-8 shadow-inner">
                  <div className="absolute inset-8 rounded-full border-[18px] border-amber-200/80 bg-red-500/80 shadow-inner" />
                  <div className="absolute left-[28%] top-[24%] size-12 rounded-full bg-rose-800 shadow-md" />
                  <div className="absolute right-[23%] top-[31%] size-10 rounded-full bg-rose-800 shadow-md" />
                  <div className="absolute bottom-[25%] left-[35%] size-11 rounded-full bg-rose-800 shadow-md" />
                  <div className="absolute bottom-[35%] right-[31%] size-8 rounded-full bg-emerald-700 shadow-md" />
                  <div className="absolute left-[45%] top-[44%] size-9 rounded-full bg-emerald-700 shadow-md" />
                  <div className="absolute inset-0 grid place-items-center text-7xl drop-shadow-sm">🍕</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">Stone-deck menu</Badge>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Pizzas built for delivery.</h2>
            <p className="mt-4 max-w-2xl text-stone-600">
              Every pie is par-baked for structure, finished to order, rested for 90 seconds and packed with vented liners so it reaches you crisp.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryButtons.map((category) => (
              <Button
                key={category.value}
                type="button"
                variant={activeCategory === category.value ? "default" : "outline"}
                className={cn(
                  "rounded-full",
                  activeCategory === category.value
                    ? "bg-stone-950 text-white hover:bg-stone-800"
                    : "border-orange-200 bg-white/70 hover:bg-white",
                )}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredMenu.map((item) => {
            const inCart = cart.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0
            return (
              <Card key={item.id} className="overflow-hidden border-orange-100 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/10">
                <div className={cn("mx-6 flex aspect-video items-center justify-center rounded-3xl bg-gradient-to-br text-6xl shadow-inner", item.accent)}>
                  <span className="drop-shadow-lg">{item.emoji}</span>
                </div>
                <CardHeader className="pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl leading-6">{item.name}</CardTitle>
                    <Badge variant="outline" className={cn("shrink-0", item.veg ? "border-emerald-300 text-emerald-700" : "border-red-300 text-red-700")}>
                      {item.veg ? <Leaf className="size-3" /> : <Flame className="size-3" />}
                      {item.veg ? "Veg" : "Non-veg"}
                    </Badge>
                  </div>
                  <CardDescription className="leading-6">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800">
                        {tag}
                      </span>
                    ))}
                    {item.heat > 0 && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                        {"🌶".repeat(item.heat)} heat
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">from</p>
                    <p className="text-2xl font-black">{formatCurrency(item.price)}</p>
                  </div>
                  <Button type="button" className="rounded-full bg-orange-600 text-white hover:bg-orange-700" onClick={() => addToCart(item)}>
                    {inCart > 0 ? `${inCart} added` : "Add"}
                    <Plus className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>

      <section id="story" className="bg-stone-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <Badge className="mb-5 border-orange-300/40 bg-orange-400/10 text-orange-200" variant="outline">
              <ChefHat className="size-3.5" />
              The HSR kitchen standard
            </Badge>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Small footprint. Serious pizza craft.</h2>
            <p className="mt-5 text-lg leading-8 text-stone-300">
              We operate as a delivery-first kitchen near 27th Main, which means lower overheads, faster dispatches and obsessive control over how pizza travels. For celebrations, we open a limited chef&apos;s table window for small groups to taste the menu fresh from the deck.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["72-hour dough", "Slow fermentation for a crisp, airy crust that stays light."],
              ["Vented boxes", "Packed to release steam, protect toppings and prevent soggy slices."],
              ["HSR radius", "Optimised routes for Sector 1-7, Agara, Bellandur and BTM edge."],
              ["Chef's table", "Two intimate tasting slots per evening for up to eight guests."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-200">
                  <Check className="size-5" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-stone-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-100">
            <CalendarCheck className="size-3.5" />
            Table / order booking system
          </Badge>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Plan dinner in under a minute.</h2>
          <p className="mt-4 leading-7 text-stone-600">
            Add pizzas to your cart, select delivery or pickup, or reserve a chef&apos;s table tasting. Your confirmation is generated instantly and saved in this browser.
          </p>

          <Card className="mt-8 border-orange-100 bg-white/85 shadow-xl shadow-orange-900/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl">
                Your cart
                <Badge variant="secondary" className="rounded-full">{itemCount} items</Badge>
              </CardTitle>
              <CardDescription>Orders dispatch from HSR Layout. Table booking includes a refundable ₹100 per guest hold.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/60 p-6 text-center">
                  <Pizza className="mx-auto mb-3 size-8 text-orange-500" />
                  <p className="font-bold">Your pizza box is empty.</p>
                  <p className="mt-1 text-sm text-stone-500">Add items from the menu or book a chef&apos;s table without ordering.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-3xl border border-orange-100 bg-white p-3">
                    <div className={cn("grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-3xl", item.accent)}>{item.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold leading-tight">{item.name}</p>
                          <p className="mt-1 text-sm text-stone-500">{formatCurrency(item.price)} each</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon-sm" className="text-stone-400 hover:text-red-600" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-orange-100 bg-orange-50 p-1">
                          <Button type="button" variant="ghost" size="icon-sm" className="size-7 rounded-full" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`}>
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                          <Button type="button" variant="ghost" size="icon-sm" className="size-7 rounded-full" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name}`}>
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                        <p className="font-black">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {errors.cart && <p className="text-sm font-medium text-red-600">{errors.cart}</p>}
              <div className="space-y-2 border-t border-orange-100 pt-4 text-sm">
                <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-stone-600"><span>Packaging</span><span>{formatCurrency(packaging)}</span></div>
                <div className="flex justify-between text-stone-600"><span>{mode === "delivery" ? "Delivery fee" : "Delivery fee"}</span><span>{formatCurrency(deliveryFee)}</span></div>
                {mode === "table" && <div className="flex justify-between text-stone-600"><span>Table hold</span><span>{formatCurrency(tableDeposit)}</span></div>}
                <div className="flex justify-between border-t border-orange-100 pt-3 text-lg font-black"><span>Total due</span><span>{formatCurrency(total)}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-orange-100 bg-white/90 shadow-xl shadow-orange-900/10">
          <CardHeader>
            <CardTitle className="text-2xl">Book delivery, pickup or table</CardTitle>
            <CardDescription>Open daily from 12 PM - 10 PM. Delivery available within a 5 km HSR radius.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(value) => setMode(value as BookingMode)} className="gap-6">
              <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-orange-50 p-1">
                <TabsTrigger value="delivery" className="rounded-xl py-3">Delivery</TabsTrigger>
                <TabsTrigger value="pickup" className="rounded-xl py-3">Pickup</TabsTrigger>
                <TabsTrigger value="table" className="rounded-xl py-3">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="delivery" className="rounded-3xl bg-orange-50/60 p-5 text-sm leading-6 text-stone-600">
                <Bike className="mb-2 size-5 text-orange-600" />
                Hot delivery to HSR Layout, Agara, Bellandur and Koramangala edge. We call before dispatch.
              </TabsContent>
              <TabsContent value="pickup" className="rounded-3xl bg-orange-50/60 p-5 text-sm leading-6 text-stone-600">
                <ShoppingBag className="mb-2 size-5 text-orange-600" />
                Skip the queue with scheduled pickup from our 27th Main kitchen counter.
              </TabsContent>
              <TabsContent value="table" className="rounded-3xl bg-orange-50/60 p-5 text-sm leading-6 text-stone-600">
                <Utensils className="mb-2 size-5 text-orange-600" />
                Reserve the chef&apos;s table tasting nook. Two intimate slots per evening, up to 8 guests.
              </TabsContent>
            </Tabs>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your full name" className="h-12 rounded-2xl bg-white" aria-invalid={Boolean(errors.name)} />
                </Field>
                <Field label="Mobile number" error={errors.phone}>
                  <Input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="98765 43210" inputMode="tel" className="h-12 rounded-2xl bg-white" aria-invalid={Boolean(errors.phone)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Date" error={errors.date}>
                  <Input type="date" min={todayForInput()} value={form.date} onChange={(event) => updateField("date", event.target.value)} className="h-12 rounded-2xl bg-white" aria-invalid={Boolean(errors.date)} />
                </Field>
                <Field label="Time" error={errors.time}>
                  <Select value={form.time} onValueChange={(value) => updateField("time", value)}>
                    <SelectTrigger className="h-12 w-full rounded-2xl bg-white" aria-invalid={Boolean(errors.time)}>
                      <SelectValue placeholder="Choose slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={mode === "table" ? "Guests" : "People"} error={errors.guests}>
                  <Select value={form.guests} onValueChange={(value) => updateField("guests", value)}>
                    <SelectTrigger className="h-12 w-full rounded-2xl bg-white" aria-invalid={Boolean(errors.guests)}>
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, index) => `${index + 1}`).map((guest) => <SelectItem key={guest} value={guest}>{guest} {guest === "1" ? "guest" : "guests"}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {mode === "delivery" && (
                <Field label="Delivery address" error={errors.address}>
                  <Textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Flat, building, street and nearest HSR landmark" className="min-h-24 rounded-2xl bg-white" aria-invalid={Boolean(errors.address)} />
                </Field>
              )}

              <Field label="Notes for the kitchen" error={errors.notes}>
                <Textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="No onion, extra chilli oil, birthday message, parking instructions..." className="min-h-24 rounded-2xl bg-white" />
              </Field>

              <Button type="submit" size="lg" className="h-13 w-full rounded-full bg-stone-950 text-base text-white hover:bg-stone-800">
                {mode === "table" ? "Reserve table slot" : mode === "pickup" ? "Schedule pickup" : "Confirm delivery order"}
                <ArrowRight className="size-5" />
              </Button>
            </form>

            {confirmation && (
              <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950" role="status" aria-live="polite">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="size-5" />
                  </span>
                  <div>
                    <p className="text-lg font-black">Confirmed: {confirmation.id}</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      Thanks {confirmation.name}. Your {confirmation.mode} booking is set for {confirmation.date} at {confirmation.time}. Estimated total: {formatCurrency(confirmation.total)}.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Sparkles className="size-3.5" />
              Loved locally
            </Badge>
            <h2 className="text-4xl font-black tracking-tight">What HSR is saying</h2>
          </div>
          <div className="flex items-center gap-1 text-orange-500" aria-label="4.8 star rating">
            {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-5 fill-current" />)}
            <span className="ml-2 text-sm font-bold text-stone-600">4.8 from 1,200+ orders</span>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-orange-100 bg-white/85">
              <CardContent className="pt-2">
                <p className="text-lg leading-8 text-stone-700">“{testimonial.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-xl font-black text-orange-700">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black">{testimonial.name}</p>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-orange-200 bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-stone-950 text-xl">🍕</span>
              <div>
                <p className="text-lg font-black">Slice Yard HSR</p>
                <p className="text-sm text-stone-500">Pizza cloud kitchen · HSR Layout</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-stone-600">
              Delivery-first pizzeria serving sourdough pizza, sides and limited chef&apos;s table tastings from Bengaluru&apos;s HSR Layout.
            </p>
          </div>
          <div>
            <h3 className="font-black">Visit / pickup</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              27th Main Road, Sector 2<br />HSR Layout, Bengaluru 560102
            </p>
          </div>
          <div>
            <h3 className="font-black">Contact</h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-stone-600"><Phone className="size-4 text-orange-600" /> +91 80 4567 2211</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-stone-600"><Clock3 className="size-4 text-orange-600" /> 12 PM - 10 PM daily</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-stone-700">{label}</span>
      {children}
      {error && <span className="block text-sm font-medium text-red-600">{error}</span>}
    </label>
  )
}
