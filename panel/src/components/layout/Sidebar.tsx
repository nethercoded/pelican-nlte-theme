"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Dns as ServersIcon,
  Storage as NodesIcon,
  Egg as EggsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 220;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const clientNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <DashboardIcon sx={{ fontSize: 15 }} /> },
  { label: "Servers", href: "/servers", icon: <ServersIcon sx={{ fontSize: 15 }} /> },
];

const adminNav: NavItem[] = [
  { label: "Nodes", href: "/admin/nodes", icon: <NodesIcon sx={{ fontSize: 15 }} /> },
  { label: "Eggs", href: "/admin/eggs", icon: <EggsIcon sx={{ fontSize: 15 }} /> },
  { label: "Users", href: "/admin/users", icon: <UsersIcon sx={{ fontSize: 15 }} /> },
  { label: "Settings", href: "/admin/settings", icon: <SettingsIcon sx={{ fontSize: 15 }} /> },
];

function ZoneLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        px: 2,
        pt: 2,
        pb: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box sx={{ flex: 1, height: "1px", bgcolor: "#262421" }} />
      <Typography
        sx={{
          fontSize: "0.58rem",
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#4a4540",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: "#262421" }} />
    </Box>
  );
}

function NavItem({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: (href: string) => void;
}) {
  return (
    <Box
      onClick={() => onNavigate(item.href)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 0.85,
        mx: 1,
        my: 0.15,
        borderRadius: "2px",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.12s",
        backgroundColor: isActive ? "rgba(212,163,115,0.07)" : "transparent",
        "&:hover": {
          backgroundColor: isActive
            ? "rgba(212,163,115,0.1)"
            : "rgba(212,163,115,0.03)",
        },
        "&::before": isActive
          ? {
              content: '""',
              position: "absolute",
              left: 0,
              top: "12%",
              bottom: "12%",
              width: "2px",
              backgroundColor: "#D4A373",
              borderRadius: "0 1px 1px 0",
            }
          : {},
      }}
    >
      <Box sx={{ color: isActive ? "#D4A373" : "#4a4540", display: "flex", flexShrink: 0 }}>
        {item.icon}
      </Box>
      <Typography
        sx={{
          fontSize: "0.82rem",
          fontFamily: '"NLTE", monospace',
          fontWeight: isActive ? 600 : 400,
          letterSpacing: isActive ? "0.04em" : "0.02em",
          color: isActive ? "#f5f0eb" : "#6b6560",
          transition: "color 0.12s",
        }}
      >
        {item.label}
      </Typography>
    </Box>
  );
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  const navigate = (href: string) => {
    router.push(href);
    if (isMobile) setMobileOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#050505",
        borderRight: "1px solid #262421",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.5,
          pb: 2,
          borderBottom: "1px solid #262421",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.25 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              bgcolor: "#D4A373",
              borderRadius: "2px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 900, color: "#000", fontFamily: "monospace", letterSpacing: "-0.02em" }}>
              NL
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontFamily: '"NLTE", monospace',
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#f5f0eb",
                lineHeight: 1,
              }}
            >
              NLManager
            </Typography>
            <Typography
              sx={{
                fontSize: "0.55rem",
                fontFamily: "monospace",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#4a4540",
                lineHeight: 1.4,
              }}
            >
              Game Panel
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto", py: 0.5 }}>

        {/* Client zone */}
        <ZoneLabel>Client</ZoneLabel>
        <Box sx={{ mt: 0.5 }}>
          {clientNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              onNavigate={navigate}
            />
          ))}
        </Box>

        {/* Admin zone */}
        {isAdmin && (
          <>
            <ZoneLabel>Admin</ZoneLabel>
            <Box sx={{ mt: 0.5 }}>
              {adminNav.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onNavigate={navigate}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* User profile footer */}
      <Box
        sx={{
          borderTop: "1px solid #262421",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "2px",
            bgcolor: "#1a1814",
            border: "1px solid #262421",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#D4A373",
              fontFamily: "monospace",
            }}
          >
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#f5f0eb",
              fontFamily: '"NLTE", monospace',
              lineHeight: 1.2,
            }}
            noWrap
          >
            {session?.user?.name || "User"}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.62rem",
              color: "#4a4540",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
            noWrap
          >
            {isAdmin ? "ADMINISTRATOR" : "CLIENT"}
          </Typography>
        </Box>

        <Tooltip title="Sign out" placement="top">
          <IconButton
            size="small"
            onClick={() => signOut({ callbackUrl: "/login" })}
            sx={{
              color: "#4a4540",
              borderRadius: "2px",
              flexShrink: 0,
              "&:hover": { color: "#ef4444", bgcolor: "rgba(239,68,68,0.08)" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: "none" },
          bgcolor: "#050505",
          borderBottom: "1px solid #262421",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: "50px !important", px: 2 }}>
          <IconButton
            edge="start"
            size="small"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ color: "#6b6560" }}
          >
            <MenuIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "#D4A373",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.5rem", fontWeight: 900, color: "#000", fontFamily: "monospace" }}>
              NL
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontFamily: '"NLTE", monospace',
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#f5f0eb",
            }}
          >
            NLManager
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            bgcolor: "#050505",
            border: "none",
            borderRight: "1px solid #262421",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#050505",
            border: "none",
            borderRight: "1px solid #262421",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#050505",
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: { xs: "50px", md: 0 },
        }}
      >
        <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
