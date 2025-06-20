import { ArrowUpRight, BoxIcon, CircleAlert, CornerDownRight, EllipsisVerticalIcon, LayoutGrid, MenuIcon, SquarePenIcon } from "lucide-react";
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useMedia } from 'react-use';
import { Link, router, usePage } from "@inertiajs/react";
import { Separator } from "../ui/separator";
import { SharedData } from "@/types";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import AppearanceToggleDropdown from "../appearance-dropdown";

function Header() {
    const breakpointLg = useMedia("(min-width: 1024px)");
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
    const { auth } = usePage<SharedData>().props;

    const menuItems = [
        {
            name: "Blog",
            href: "/blog",
        },
        {
            name: "About",
            href: "/about",
        },
    ]

    return (
        <header className="sticky z-50 top-0">
            <nav className={`relative max-w-screen-2xl mx-auto group transition duration-500 backdrop-blur-sm bg-white/50 dark:bg-neutral-950/50 border-b border-template`}>
                <div className={`px-2.5 md:px-4 py-2.5`}>
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2 pe-4">
                                <span className="md:text-lg font-medium whitespace-nowrap dark:text-white">
                                    {appName}
                                </span>
                            </Link>
                            <Separator orientation="vertical" className="hidden md:block h-7" />
                            {/* <NavMenu /> */}
                            <div className="hidden md:flex flex-wrap gap-4 px-4">
                                {menuItems.map((item, index) => (
                                    <Link key={index} href={item.href} className="hover:text-black hover:dark:text-white text-sm transition-colors duration-150">{item.name}</Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <AppearanceToggleDropdown />
                            {auth.user && <Button onClick={() => router.visit(route("dashboard"))} variant={'headerOutline'} size={breakpointLg ? 'sm' : 'iconSm'}><LayoutGrid /><span className="hidden lg:inline">Dashboard</span></Button>}
                            <div className="h-7 mx-3">
                                <Separator orientation="vertical" className="h-7" />
                            </div>
                            <div className="hidden md:block space-x-1">
                                {auth.user ? (
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div className="flex items-center">
                                                    <span className="hidden md:inline-block mr-2 text-sm font-medium text-neutral-800 dark:text-white cursor-pointer">
                                                        {auth.user.email || "Unknown"}
                                                    </span>
                                                    <Avatar className="h-8 w-8 cursor-pointer">
                                                        <AvatarImage src={auth.user.avatar} alt="@shadcn" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger className="w-full text-start text-sm font-medium text-red-500 hover:dark:bg-neutral-800 rounded px-2 py-1.5">
                                                            logout
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader className="py-12">
                                                                <AlertDialogTitle className="text-black dark:text-white text-2xl text-center">Are you sure you want to log out?</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-center">
                                                                    You will log out from {auth.user.email}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                                                                {/* <AlertDialogAction onClick={handleSignOut} className="w-full">Log out</AlertDialogAction> */}
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : (
                                    <>
                                        <Button onClick={() => router.visit(route('login'))} variant={'headerTransparent'} size={'sm'}>Log in</Button>
                                        <Button onClick={() => router.visit(route('register'))} variant={'headerOutline'} size={'sm'}>Register</Button>
                                    </>
                                )}
                            </div>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button type="button" variant={'ghost'} size={'icon'} className="flex xl:hidden"><EllipsisVerticalIcon /></Button>
                                </SheetTrigger>
                                <SheetContent className="flex flex-col gap-4">
                                    <SheetHeader>
                                        <SheetTitle className="text-start">Menu</SheetTitle>
                                        <SheetDescription className="hidden"></SheetDescription>
                                    </SheetHeader>
                                    <div className="flex-grow space-y-4">
                                        {auth.user ? (
                                            <div onClick={() => router.visit(route('login'))} className="p-2 flex items-center gap-2 hover:bg-neutral-200 hover:dark:bg-neutral-900 border border-template rounded-lg transition-colors duration-150 cursor-pointer">
                                                <Avatar className="h-8 w-8 cursor-pointer">
                                                    <AvatarImage src={auth.user.avatar} alt="@shadcn" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="line-clamp-1 text-black dark:text-white text-sm">{auth.user.name || "Unknown"}</p>
                                                    <p className="line-clamp-1 text-[10px]">{auth.user.email || "---"}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div onClick={() => router.visit(route('login'))} className="p-2 flex items-center gap-2 hover:bg-neutral-200 hover:dark:bg-neutral-900 border border-template rounded-lg transition-colors duration-150 cursor-pointer">
                                                <div className="w-8 h-8 bg-neutral-900 border border-template rounded-full" />
                                                <div>
                                                    <p className="line-clamp-1 text-black dark:text-white text-sm">Guest User</p>
                                                    <p className="line-clamp-1 text-[10px]">Login to show your profile.</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            {menuItems.map((item, index) => (
                                                <Link key={index} href={item.href} className="block text-sm md:text-base font-medium hover:bg-neutral-200 hover:dark:bg-neutral-900 rounded px-2 py-1 transition-colors hover:text-black hover:dark:text-white duration-300"><CornerDownRight className="inline h-3 w-3 mb-0.5 me-2 text-neutral-500" />{item.name}</Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {!auth.user ? (
                                            <>
                                                <Button onClick={() => router.visit(route('login'))} variant={'editorBlockBar'} size={'sm'} className="w-full">Sign In</Button>
                                                <Button onClick={() => router.visit(route('register'))} variant={'submit'} size={'sm'} className="w-full">Sign Up</Button>
                                            </>
                                        ) : (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button type="button" variant={'destructive'} size={'sm'} className="w-full">logout</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader className="py-12">
                                                        <AlertDialogTitle className="text-black dark:text-white text-2xl text-center">Are you sure you want to log out?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-center">
                                                            You will log out from {auth.user.email}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                                                        {/* <AlertDialogAction onClick={handleSignOut} className="w-full">Log out</AlertDialogAction> */}
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;