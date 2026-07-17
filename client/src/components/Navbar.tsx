import { Bell, Search, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <div className="mx-auto w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <main className="flex bg-primary items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <ShoppingBag className="text-white size-8" />
          <h1 className="text-white text-3xl font-bold">Shopify</h1>
        </div>
        <div className="flex flex-1 items-center gap-8 mx-40">
          <Field className="ml-auto flex-1 group">
            <ButtonGroup className="w-full">
              <Input
                className="h-8"
                id="input-button-group"
                placeholder="Type to search..."
              />
              <Button
                variant="default"
                className="text-white h-8 w-15 border-2 border-white"
              >
                <Search color="white" className="size-4" />
              </Button>
            </ButtonGroup>
          </Field>
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-4">
            <ShoppingCart className="text-white size-6" />
            <Bell className="text-white size-6" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </main>
      <div className="text-white text-sm font-light space-x-6 justify-center">
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
        <a className="hover:underline" href="">
          Electronics
        </a>
      </div>
    </div>
  );
};
export default Navbar;
