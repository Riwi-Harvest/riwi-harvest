/** @jsx h */
import logo from "@/assets/logoriwiharvest.png";
import ButtonIcon from "@/components/ui/button-icon";
import routeNames from "@/lib/routes.json";
import { navigate } from "@harvest/router";

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
        <div className="flex-1 flex justify-end">
          <ButtonIcon onClick={() => navigate('/update')} label="Sincronizar">
            <i class="fa-solid fa-rotate"></i>
          </ButtonIcon>
        </div>
      </div>
    </header>
  );
}
