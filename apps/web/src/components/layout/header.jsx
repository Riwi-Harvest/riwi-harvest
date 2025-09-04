/** @jsx h */
import ButtonIcon from "@/components/ui/button-icon";
import routeNames from "@/lib/routes.json";
import logo from "@/assets/logoriwiharvest.png";

export default function Header() {
  return (
    <header className="flex sticky top-0 z-100 py-2 items-center bg-branch border-b border-b-divider-dark h-15">
      <div className="flex items-center w-(--sidebar-width) px-4">
        <ButtonIcon label="Menú">
          <i class="fa-solid fa-bars"></i>
        </ButtonIcon>
        <img
         src={logo}
          className="h-8 ml-5"
        />
      </div>
      <div className="flex gap-2 flex-1">
        <h2 className="text-xl font-semibold text-white">
          {routeNames[window.location.pathname]}
        </h2>
      </div>
    </header>
  );
}
