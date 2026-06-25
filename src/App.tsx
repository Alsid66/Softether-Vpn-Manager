import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  Plus,
  Trash2,
  Users,
  Activity,
  Wifi,
  Settings,
  X,
  Key,
  RefreshCw,
  Sliders,
  LogOut,
  HelpCircle,
  FileCode,
  Download,
  Shield,
  Layers,
  Network,
  CheckCircle,
  AlertCircle,
  Send,
  Zap,
  Globe,
  Radio,
  Lock,
  Clock,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

// Profile interface for Saved SoftEther Servers
interface ServerProfile {
  id: string;
  name: string;
  host: string;
  port: number;
  password?: string;
  hubName: string;
  bypassSsl: boolean;
  isDemo: boolean;
}

// User representation
interface SetUserParams {
  name: string;
  password?: string;
  authType: 'password' | 'anonymous' | 'radius';
  expires?: string;
}

export default function App() {
  // Locale State: 'en' for English, 'fa' for Persian (Farsi)
  const [lang, setLang] = useState<'en' | 'fa'>('en');

  // Server profiles management
  const [profiles, setProfiles] = useState<ServerProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  
  // Create / Edit Profile Form state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [newProfileHost, setNewProfileHost] = useState<string>('');
  const [newProfilePort, setNewProfilePort] = useState<number>(443);
  const [newProfilePassword, setNewProfilePassword] = useState<string>('');
  const [newProfileHub, setNewProfileHub] = useState<string>('DEFAULT');
  const [newProfileBypassSsl, setNewProfileBypassSsl] = useState<boolean>(true);
  const [newProfileIsDemo, setNewProfileIsDemo] = useState<boolean>(false);

  // Connection state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Active status data fetched from SoftEther API or Mock Data
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [hubsList, setHubsList] = useState<any[]>([]);
  const [selectedHub, setSelectedHub] = useState<string>('DEFAULT');
  const [hubStatus, setHubStatus] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [ipSecSettings, setIpSecSettings] = useState<any>(null);
  const [openVpnConfig, setOpenVpnConfig] = useState<any>(null);

  // Active Hub status polling
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(5);

  // Nav Tabs: 'overview' | 'users' | 'sessions' | 'protocols' | 'wizard'
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'sessions' | 'protocols' | 'wizard'>('overview');

  // form and interaction states
  const [newUser, setNewUser] = useState<string>('');
  const [newUserPass, setNewUserPass] = useState<string>('');
  const [newUserAuthType, setNewUserAuthType] = useState<'password' | 'radius'>('password');
  const [newUserNote, setNewUserNote] = useState<string>('');
  
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // SSL config state editable
  const [ipsecPresharedKey, setIpsecPresharedKey] = useState<string>('vpn');
  const [isL2tpEnabled, setIsL2tpEnabled] = useState<boolean>(true);
  const [isOpenVpnEnabled, setIsOpenVpnEnabled] = useState<boolean>(true);
  const [openVpnPorts, setOpenVpnPorts] = useState<string>('1194');
  const [isSstpEnabled, setIsSstpEnabled] = useState<boolean>(true);

  // Bandwidth history for drawing interactive real-time visual charts
  const [bandwidthHistory, setBandwidthHistory] = useState<{ time: number; inbound: number; outbound: number }[]>([]);

  // Selected Profile object lookup
  const currentProfile = profiles.find(p => p.id === selectedProfileId);

  // Localization Dictionary
  const t = {
    en: {
      appName: "SoftEther Connect",
      appDesc: "Remote Administrative Console",
      personalServers: "Personal Servers",
      addNewServer: "+ Add VPN Server",
      systemStatus: "System Status",
      connected: "Authenticated",
      disconnected: "Disconnected",
      demoSandbox: "Sandbox Mode",
      connecting: "Connecting...",
      addServerTitle: "Add SoftEther VPN Server",
      profileName: "Profile Identifier Name",
      serverIpHost: "VPN Server IP or Domain Name",
      serverPort: "JSON-RPC API Port",
      adminPassword: "Administrator Password",
      virtualHub: "Target Virtual Hub Name",
      bypassCertificate: "Ignore Self-Signed SSL Error (Recommended)",
      sandboxProfile: "Use Demo Sandbox Mode (Check out UI)",
      cancel: "Cancel",
      save: "Save Server Connection",
      host: "Host",
      port: "Port",
      password: "Password",
      status: "Status",
      overview: "Overview",
      users: "User Credentials",
      sessions: "Live Connections",
      protocols: "SSTP/L2TP/SSL Config",
      wizard: "Connect Client Guide",
      serverProduct: "VPN Server Core Version",
      serverOs: "Host Operating System",
      cpuRAM: "CPU & Memory Statistics",
      totalSessions: "Total Active Tunnels",
      totalHubs: "Active Virtual Hubs",
      inbound: "Inbound Rate (DL)",
      outbound: "Outbound Rate (UL)",
      refresh: "Quick Sync",
      addUser: "Generate VPN User",
      username: "Username",
      authType: "Auth Mechanism",
      expires: "Expiration",
      statusActive: "Active Connection",
      statusOffline: "Configured Offline",
      deleteUser: "Revoke Account",
      kickSession: "Disconnect User",
      sessionName: "Tunnel Reference",
      clientIp: "Client Remote IP Address",
      macAddress: "VLAN Virtual MAC",
      connectedTime: "Uptime Duration",
      protocolsTitle: "SoftEther Encrypted Engine Configurations",
      saveProtocols: "Commit Protocol Config",
      secNat: "Virtual SecureNAT (DHCP + Host NAT)",
      secNatDesc: "Automatically distributes IP addresses and provides internet forwarding internally without native routing bridges.",
      vpnAzure: "SoftEther VPN Azure Relay",
      vpnAzureDesc: "Dynamic cloud-mediated firewall bypass, enabling VPN tunnels even behind deep corporate NATs or dynamic CG-NAT ISPs.",
      presharedKey: "IPsec L2TP Pre-Shared Secret Key",
      openVpnPort: "OpenVPN Listener UDP Ports",
      sstpService: "Enable Secure SSTP SSL Protocol",
      setupWizardTitle: "VPN Connection Client Quick Configuration Wizard",
      setupWizardDesc: "Quick configuration strings customized directly from your active VPN server's configurations.",
      sstpDesc: "Native Windows SSTP clients connect directly using SSL. Zero additional client installations needed.",
      l2tpDesc: "Native Smartphone/Computer VPN Client Setup. Uses IPsec protection layer with Pre-Shared Key.",
      sslClientDesc: "Utilizes SoftEther's ultra-premium SSL client program supplying full 1Gbps speeds over single-port SSL tunnels.",
      connectedSuccess: "Authenticated securely to SoftEther JSON-RPC!",
      deleteSuccess: "Successfully parsed command and purged object.",
      createSuccess: "Parsed credential config and generated VPN client.",
      errorConnecting: "JSON-RPC connection failed. Verify host, port, credentials, or firewall access.",
      requiredField: "This parameter is required.",
    },
    fa: {
      appName: "مدیریت سافت‌اتر",
      appDesc: "کنسول مدیریتی و نظارتی مستقیم سرور",
      personalServers: "سرورهای اتصال شخصی",
      addNewServer: "+ افزودن سرور جدید",
      systemStatus: "وضعیت سیستم",
      connected: "متصل شده",
      disconnected: "قطع اتصال",
      demoSandbox: "کنسول آزمایشی دمو",
      connecting: "درحال برقراری ارتباط...",
      addServerTitle: "افزودن مشخصات سرور SoftEther",
      profileName: "نام نمایشی پروفایل سرور",
      serverIpHost: "آدرس IP یا دامنه سرور",
      serverPort: "پورت وب‌سرویس JSON-RPC",
      adminPassword: "کلمه عبور مدیر سرور (روت)",
      virtualHub: "نام هاب مجازی پیش‌فرض (Virtual Hub)",
      bypassCertificate: "چشم‌پوشی از گواهی‌های بدون امضا SSL (توصیه شده)",
      sandboxProfile: "استفاده از حالت نمایشی دمو (آزمایش ویژگی‌ها)",
      cancel: "انصراف",
      save: "ذخیره و پیوند ارتباطی",
      host: "آدرس وب",
      port: "پورت",
      password: "رمز عبور",
      status: "وضعیت",
      overview: "داشبورد کلی",
      users: "حساب‌های کاربری (VPN Users)",
      sessions: "تونل‌های فعال (Sessions)",
      protocols: "تنظیمات SSTP / L2TP / SSL",
      wizard: "راهنمای اتصال مشتریان (Config)",
      serverProduct: "نسخه و مدل سرور نصب شده",
      serverOs: "سیستم عامل میزبان سرور",
      cpuRAM: "منابع رم و پردازنده سرور",
      totalSessions: "کل کاربران متصل همزمان",
      totalHubs: "تعداد کل هاب‌های فعال",
      inbound: "ترافیک دریافتی (دانلود)",
      outbound: "ترافیک ارسالی (آپلود)",
      refresh: "بروزرسانی زنده",
      addUser: "ساخت کاربر جدید VPN",
      username: "نام کاربری",
      authType: "نوع احراز هویت",
      expires: "تاریخ انقضا",
      statusActive: "کاربر فعال آنلاین",
      statusOffline: "آفلاین / بدون ارتباط",
      deleteUser: "حذف کاربر",
      kickSession: "قطع دسترسی آنلاین",
      sessionName: "شناسه تونل کاربری",
      clientIp: "آدرس IP و پورت کاربر",
      macAddress: "مک آدرس مجازی",
      connectedTime: "میزان زمان اتصال گذشته",
      protocolsTitle: "پروتکل‌های اتصال تحت کنترل لایسنسینگ سافت‌اتر",
      saveProtocols: "ذخیره نهایی تنظیمات پروتکل",
      secNat: "سرویس کلیدی SecureNAT (DHCP و NAT مجازی)",
      secNatDesc: "توزیع خودکار آدرس‌های IP داخلی و ایجاد تونل فورواردینگ ترافیک اینترنت بدون نیاز به پیکربندی محلی کارت شبکه‌ها.",
      vpnAzure: "سرویس ابری SoftEther VPN Azure",
      vpnAzureDesc: "دور زدن دیوارهای آتشین قوی با میانجی‌گری سرورهای ابری، دسترسی دائم از پشت مودم‌های دارای آی پی داینامیک.",
      presharedKey: "رمز مشترک پیش‌فرض L2TP (IPsec Preshared Key)",
      openVpnPort: "پورت‌های دریافت ترافیک UDP OpenVPN",
      sstpService: "فعال‌سازی سرویس امن و محبوب SSTP SSL",
      setupWizardTitle: "راه‌کار و راهنمای ساخت کانکشن برای کاربران شما",
      setupWizardDesc: "رشته‌ها و اطلاعات پیکربندی کاملاً منطبق بر اطلاعات کنونی سرور شخصی شما که کاربران برای اتصال به آن نیاز دارند.",
      sstpDesc: "اتصال پیش‌فرض و ایمن ویندوز بدون نصب برنامه جانبی با تکیه بر پروتکل امن HTTPS مایکروسافت.",
      l2tpDesc: "سازگار با انواع دستگاه‌های موبایل اندروید/آیفون قدیمی و جدید با تکیه بر رمز عبور اشتراکی IPsec.",
      sslClientDesc: "اتصال با کلاینت رسمی و قدرتمند SoftEther VPN Client جهت دریافت ثبات کابل‌کشی شده و پایداری حداکثری.",
      connectedSuccess: "با موفقیت به وب سرویس سرور سافت‌اتر متصل شدید!",
      deleteSuccess: "کاربر یا سشن با موفقیت از هاب سرور حذف شد.",
      createSuccess: "کاربر جدید با موفقیت روی بانک اطلاعاتی پرووایدر ساخته شد.",
      errorConnecting: "خطا در اتصال به وب‌سرویس JSON-RPC سرور. لطفاً پورت، آدرس، فایروال یا صحت روشن بودن سرور را بررسی کنید.",
      requiredField: "تکمیل این فیلد الزامی است.",
    }
  };

  // Initialize server profiles from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('se_manager_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);
        if (parsed.length > 0) {
          setSelectedProfileId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse profiles", e);
      }
    } else {
      // Create first default Demo profile to let them navigate instantly
      const defaultDemo: ServerProfile = {
        id: 'demo-central',
        name: 'Frankfurt-Main-01 (Demo Sandbox)',
        host: '45.132.112.9',
        port: 443,
        password: '',
        hubName: 'DEFAULT',
        bypassSsl: true,
        isDemo: true
      };
      const initial = [defaultDemo];
      setProfiles(initial);
      setSelectedProfileId(defaultDemo.id);
      localStorage.setItem('se_manager_profiles', JSON.stringify(initial));
    }
  }, []);

  // Save profiles to localStorage whenever they change
  const saveAndSyncProfiles = (newProfiles: ServerProfile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('se_manager_profiles', JSON.stringify(newProfiles));
  };

  // Switch server connection status when a profile is selected
  useEffect(() => {
    if (!selectedProfileId) {
      setIsConnected(false);
      return;
    }
    handleConnect();
  }, [selectedProfileId]);

  // Handle active bandwidth rate visualization ticks (simulated operations + live feed indicators)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        setBandwidthHistory(prev => {
          const nextIn = isConnected 
            ? (currentProfile?.isDemo 
                ? 100 + Math.random() * 450 
                : (serverStatus?.InboundByteRate / 1024 || 20) + Math.random() * 5)
            : 0;
          const nextOut = isConnected 
            ? (currentProfile?.isDemo 
                ? 50 + Math.random() * 200 
                : (serverStatus?.OutboundByteRate / 1024 || 10) + Math.random() * 3)
            : 0;

          const updated = [...prev, { time: Date.now(), inbound: nextIn, outbound: nextOut }];
          if (updated.length > 30) {
            updated.shift();
          }
          return updated;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected, serverStatus, currentProfile]);

  // Periodic statistics polling
  useEffect(() => {
    if (!isConnected || !currentProfile) return;
    const pollInterval = setInterval(() => {
      fetchServerDashboardData();
    }, refreshIntervalSec * 1000);
    return () => clearInterval(pollInterval);
  }, [isConnected, currentProfile, refreshIntervalSec, selectedHub]);

  // Fetch all SoftEther server assets & configs
  const fetchServerDashboardData = async () => {
    if (!currentProfile) return;

    if (currentProfile.isDemo) {
      // Mock data in demo mode
      loadDemoMockData();
      return;
    }

    try {
      // 1. Get Server Info
      const infoRes = await requestRpc('GetServerInfo', {});
      if (infoRes) setServerInfo(infoRes);

      // 2. Get Server Status
      const statusRes = await requestRpc('GetServerStatus', {});
      if (statusRes) setServerStatus(statusRes);

      // 3. Enum Virtual Hubs
      const hubsRes = await requestRpc('EnumHub', {});
      if (hubsRes && hubsRes.HubList) {
        setHubsList(hubsRes.HubList);
      }

      // 4. Get IPsec services config
      const ipsecRes = await requestRpc('GetIPsecServices', {});
      if (ipsecRes) {
        setIpSecSettings(ipsecRes);
        setIsL2tpEnabled(!!ipsecRes.L2TP_IPsec_bool);
        setIpsecPresharedKey(ipsecRes.IPsec_Secret_str || 'vpn');
      }

      // 5. Get OpenVPN SSTP settings
      const openvpnRes = await requestRpc('GetOpenVpnSstpConfig', {});
      if (openvpnRes) {
        setOpenVpnConfig(openvpnRes);
        setIsOpenVpnEnabled(!!openvpnRes.EnableOpenVPN_bool);
        setOpenVpnPorts(openvpnRes.OpenVpnPortList_str || '1194');
        setIsSstpEnabled(!!openvpnRes.EnableSSTP_bool);
      }

      // 6. Hub-specific info (Users & Sessions)
      if (selectedHub) {
        const usersRes = await requestRpc('EnumUser', { HubName_str: selectedHub });
        if (usersRes && usersRes.UserList) {
          setUsersList(usersRes.UserList);
        }

        const sessionsRes = await requestRpc('EnumSession', { HubName_str: selectedHub });
        if (sessionsRes && sessionsRes.SessionList) {
          setSessionsList(sessionsRes.SessionList);
        }

        const hubStatusRes = await requestRpc('GetHubStatus', { HubName_str: selectedHub });
        if (hubStatusRes) {
          setHubStatus(hubStatusRes);
        }
      }

    } catch (e: any) {
      console.error("Error fetching live data", e);
    }
  };

  // Load Demo simulated sandbox state
  const loadDemoMockData = () => {
    setServerInfo({
      ProductName_str: "SoftEther VPN Server (64 bit)",
      ProductVersion_str: "Version 4.39 Build 9772 (Stable)",
      OsName_str: "Linux Enterprise Server 15 SP3 (x86_64)",
      OsType_u32: 3,
      ServerType_u32: 0,
    });

    setServerStatus({
      InboundBytes_u64: 31229048109,
      OutboundBytes_u64: 15309228491,
      InboundByteRate: 462109,
      OutboundByteRate: 212048,
      NumSessionsTotal_u32: 6,
      NumSessionsLocal_u32: 6,
      NumHubs_u32: 3,
      NumConnections_u32: 6,
      CpuUsage_u32: 8,
      MemoryUsage_u64: 4120 * 1024 * 1024,
      TotalMemory_u64: 16384 * 1024 * 1024
    });

    setHubsList([
      { HubName_str: "DEFAULT", Online_bool: true, NumUsers_u32: 12, NumSessions_u32: 3, HubType_u32: 0 },
      { HubName_str: "SECURE", Online_bool: true, NumUsers_u32: 4, NumSessions_u32: 2, HubType_u32: 0 },
      { HubName_str: "VPN-TEHRAN", Online_bool: false, NumUsers_u32: 9, NumSessions_u32: 0, HubType_u32: 0 },
    ]);

    setHubStatus({
      HubName_str: selectedHub,
      Online_bool: selectedHub !== "VPN-TEHRAN",
      NumUsers_u32: selectedHub === "DEFAULT" ? 12 : selectedHub === "SECURE" ? 4 : 9,
      NumSessions_u32: selectedHub === "DEFAULT" ? 3 : selectedHub === "SECURE" ? 2 : 0,
      NumIpTables_u32: selectedHub === "DEFAULT" ? 3 : 1,
      NumMacTables_u32: selectedHub === "DEFAULT" ? 3 : 2,
      CreatedTime_dt: "2026-01-10T14:20:00Z",
      LastCommTime_dt: "2026-06-21T15:24:00Z"
    });

    // Populate simulated users
    if (usersList.length === 0) {
      setUsersList([
        { Name_str: "admin_ali", Realname_str: "Ali Alavi", AuthType_u32: 1, ExpirationDate_dt: "2027-01-01", Active_bool: true, NumConnections_u32: 1 },
        { Name_str: "user_reza", Realname_str: "Reza Akbari", AuthType_u32: 1, ExpirationDate_dt: "2026-12-31", Active_bool: true, NumConnections_u32: 1 },
        { Name_str: "tunnel_fra", Realname_str: "Frankfurt Bridge", AuthType_u32: 1, ExpirationDate_dt: "2026-10-15", Active_bool: true, NumConnections_u32: 1 },
        { Name_str: "guest_user", Realname_str: "Guest Account", AuthType_u32: 1, ExpirationDate_dt: "2026-07-01", Active_bool: false, NumConnections_u32: 0 },
      ]);
    }

    // Populate simulated active connected client sessions
    if (sessionsList.length === 0) {
      setSessionsList([
        { Name_str: "SID-ADMIN_ALI-1", Username_str: "admin_ali", Ip_str: "89.144.12.185", Hostname_str: "tehran-modem.dynamic.ir", ClientOsName_str: "Windows 11", CreatedTime_dt: "2026-06-21T07:22:15-07:00", MaxConnection_u32: 1 },
        { Name_str: "SID-USER_REZA-2", Username_str: "user_reza", Ip_str: "185.102.44.91", Hostname_str: "mci-mobile.net", ClientOsName_str: "Android 13 / L2TP", CreatedTime_dt: "2026-06-21T06:40:10-07:00", MaxConnection_u32: 1 },
        { Name_str: "SID-TUNNEL_FRA-3", Username_str: "tunnel_fra", Ip_str: "164.92.204.11", Hostname_str: "droplet.digitalocean.com", ClientOsName_str: "Linux / SSTP Tunnel", CreatedTime_dt: "2026-06-20T21:10:48-07:00", MaxConnection_u32: 1 },
      ]);
    }

    setIpSecSettings({
      L2TP_IPsec_bool: isL2tpEnabled,
      IPsec_Secret_str: ipsecPresharedKey
    });

    setOpenVpnConfig({
      EnableOpenVPN_bool: isOpenVpnEnabled,
      OpenVpnPortList_str: openVpnPorts,
      EnableSSTP_bool: isSstpEnabled
    });
  };

  // Helper connection/API request calling Express JSON-RPC Proxy
  const requestRpc = async (method: string, params: any): Promise<any> => {
    if (!currentProfile) return null;
    try {
      const response = await fetch('/api/softether/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: currentProfile.host,
          port: currentProfile.port,
          password: currentProfile.password,
          rejectUnauthorized: currentProfile.bypassSsl,
          method,
          params
        })
      });
      const data = await response.json();
      if (data.success) {
        return data.result;
      } else {
        throw new Error(data.error || 'RPC Method Execution Fault');
      }
    } catch (e: any) {
      console.error(`Error in SoftEther RPC [${method}]:`, e);
      throw e;
    }
  };

  // Try real authenticated connection
  const handleConnect = async () => {
    if (!selectedProfileId) return;
    const profile = profiles.find(p => p.id === selectedProfileId);
    if (!profile) return;

    setIsConnecting(true);
    setConnectionError(null);

    if (profile.isDemo) {
      // Connect to Demo instant sandbox
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        setNewProfileIsDemo(false);
        loadDemoMockData();
      }, 500);
      return;
    }

    try {
      const response = await fetch('/api/softether/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: profile.host,
          port: Number(profile.port),
          password: profile.password || '',
          rejectUnauthorized: profile.bypassSsl
        })
      });
      
      const testData = await response.json();
      if (testData.success) {
        setIsConnected(true);
        setServerInfo(testData.info);
        // Load operational endpoints
        fetchServerDashboardData();
        triggerStatusOverlay(t[lang].connectedSuccess, 'success');
      } else {
        setIsConnected(false);
        setConnectionError(testData.error || t[lang].errorConnecting);
        triggerStatusOverlay(testData.error || t[lang].errorConnecting, 'error');
      }
    } catch (e: any) {
      setIsConnected(false);
      setConnectionError(e.message || t[lang].errorConnecting);
      triggerStatusOverlay(e.message || t[lang].errorConnecting, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const triggerStatusOverlay = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setActionSuccessMessage(message);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } else {
      setActionErrorMessage(message);
      setTimeout(() => setActionErrorMessage(null), 5000);
    }
  };

  // Save new server Profile
  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileHost) {
      alert(t[lang].requiredField);
      return;
    }

    const uniqueId = 'se-prof-' + Date.now();
    const cleanProfile: ServerProfile = {
      id: uniqueId,
      name: newProfileName || `${newProfileHost}:${newProfilePort}`,
      host: newProfileHost.trim(),
      port: Number(newProfilePort),
      password: newProfilePassword,
      hubName: newProfileHub || 'DEFAULT',
      bypassSsl: newProfileBypassSsl,
      isDemo: newProfileIsDemo
    };

    const updated = [...profiles, cleanProfile];
    saveAndSyncProfiles(updated);
    setSelectedProfileId(uniqueId);
    setShowAddModal(false);

    // reset fields
    setNewProfileName('');
    setNewProfileHost('');
    setNewProfilePort(443);
    setNewProfilePassword('');
    setNewProfileHub('DEFAULT');
    setNewProfileBypassSsl(true);
    setNewProfileIsDemo(false);
  };

  const handleDeleteProfile = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering profile selection onClick
    const remaining = profiles.filter(p => p.id !== idToDelete);
    saveAndSyncProfiles(remaining);
    
    if (selectedProfileId === idToDelete) {
      if (remaining.length > 0) {
        setSelectedProfileId(remaining[0].id);
      } else {
        setSelectedProfileId('');
        setIsConnected(false);
      }
    }
  };

  // Add VPN User Credentials
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser) return;

    if (currentProfile?.isDemo) {
      // Mock create inside simulator
      const mockNewItem = {
        Name_str: newUser,
        Realname_str: newUserNote || "VPN Mobile Client",
        AuthType_u32: newUserAuthType === 'password' ? 1 : 4,
        ExpirationDate_dt: "2027-06-21",
        Active_bool: true,
        NumConnections_u32: 0
      };
      setUsersList([mockNewItem, ...usersList]);
      setShowAddUserModal(false);
      triggerStatusOverlay(t[lang].createSuccess, 'success');
      setNewUser('');
      setNewUserPass('');
      setNewUserNote('');
      return;
    }

    try {
      // Create user payload structure as required by JSON-RPC Specify
      const userParams = {
        HubName_str: selectedHub,
        Name_str: newUser,
        Realname_str: newUserNote || "Added from Web Manager",
        Note_str: "Added through Web Panel Console",
        AuthType_u32: newUserAuthType === 'password' ? 1 : 4, // 1 for standard password auth
        Auth_Password_str: newUserPass, // Plaintext, softether hashes internally or supports MD5
        UsePolicy_bool: false
      };

      await requestRpc('CreateUser', userParams);
      fetchServerDashboardData();
      setShowAddUserModal(false);
      triggerStatusOverlay(t[lang].createSuccess, 'success');
      
      setNewUser('');
      setNewUserPass('');
      setNewUserNote('');
    } catch (err: any) {
      triggerStatusOverlay(err.message || "Failed to create user credential record.", 'error');
    }
  };

  // Delete User in selected hub
  const handleDeleteUser = async (username: string) => {
    if (!confirm(`Are you absolutely sure you want to revoke account "${username}"?`)) {
      return;
    }

    if (currentProfile?.isDemo) {
      setUsersList(usersList.filter(u => u.Name_str !== username));
      triggerStatusOverlay(t[lang].deleteSuccess, 'success');
      return;
    }

    try {
      await requestRpc('DeleteUser', {
        HubName_str: selectedHub,
        Name_str: username
      });
      fetchServerDashboardData();
      triggerStatusOverlay(t[lang].deleteSuccess, 'success');
    } catch (err: any) {
      triggerStatusOverlay(err.message || "Failed to delete user", 'error');
    }
  };

  // Kill Online active connection session
  const handleKickSession = async (sessionName: string) => {
    if (!confirm(`Disconnect live tunnel session: "${sessionName}"?`)) {
      return;
    }

    if (currentProfile?.isDemo) {
      setSessionsList(sessionsList.filter(s => s.Name_str !== sessionName));
      triggerStatusOverlay(t[lang].deleteSuccess, 'success');
      return;
    }

    try {
      await requestRpc('DeleteSession', {
        HubName_str: selectedHub,
        Name_str: sessionName
      });
      fetchServerDashboardData();
      triggerStatusOverlay("Client kicked from Virtual Hub successfully.", 'success');
    } catch (err: any) {
      triggerStatusOverlay(err.message || "Could not kick online user session.", 'error');
    }
  };

  // Commit Encrypted Engine IPsec/OpenVPN Config
  const handleSaveProtocolConfigs = async () => {
    if (currentProfile?.isDemo) {
      triggerStatusOverlay("Mock configurations committed safely.", 'success');
      return;
    }

    try {
      // 1. Save L2TP/IPsec setting if user modified
      await requestRpc('SetIPsecServices', {
        L2TP_IPsec_bool: isL2tpEnabled,
        L2TP_Raw_bool: false,
        EtherIP_IPsec_bool: false,
        IPsec_Secret_str: ipsecPresharedKey
      });

      // 2. Save SSTP & OpenVPN listener configuration
      await requestRpc('SetOpenVpnSstpConfig', {
        EnableOpenVPN_bool: isOpenVpnEnabled,
        OpenVpnPortList_str: openVpnPorts,
        EnableSSTP_bool: isSstpEnabled
      });

      fetchServerDashboardData();
      triggerStatusOverlay("SoftEther server encryption protocol layers committed.", 'success');
    } catch (err: any) {
      triggerStatusOverlay(err.message || "Failed to edit protocol parameters.", 'error');
    }
  };

  // Auto download an OpenVPN Connection Config
  const downloadOvpnFile = () => {
    const configContent = `# OpenVPN Client Configuration for ${currentProfile?.name || 'My Server'}
client
dev tun
proto udp
remote ${currentProfile?.host || '12.34.56.78'} ${openVpnPorts.split(',')[0] || '1194'}
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-GCM
auth SHA384
verb 3
auth-user-pass
auth-nocache
# SSTP / SSL fallback configured
<ca>
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIUHTY6zQ8RmlZcTz5qdW5uZWwtY2EwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAoM
DXNvZnRldGhlci1jYTENMAsGA1UEAwwEY2VydDAeFw0yNjA2MjExNTI3MzBaFw0z
NTA2MjExNTI3MzBaMEUxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlh
MRYwFAYDVQQKDA1zb2Z0ZXRoZXItY2ExDTALBgNVBAMMBGNlcnQwggIiMA0GCSqG
SIb3DQEBAQUAA4ICDwAwCAgKAoICAQCtqO2H18fH6YvSIsDNYK4bU9NqTz59fH6Y
-----END CERTIFICATE-----
</ca>
# Add additional settings to force DNS routes
dhcp-option DNS 1.1.1.1
dhcp-option DNS 8.8.8.8
redirect-gateway def1
`;
    const blob = new Blob([configContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `softether-${selectedHub || 'DEFAULT'}.ovpn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Convert bytes helper
  const parseBytes = (bytes: number): string => {
    if (bytes === undefined || isNaN(bytes)) return '0 B';
    const s = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
  };

  return (
    <div className={`flex flex-col min-h-screen bg-[#080809] text-[#E0E0E0] overflow-x-hidden font-sans select-none pb-12 ${lang === 'fa' ? 'rtl' : 'ltr'}`} style={{ direction: lang === 'fa' ? 'rtl' : 'ltr' }}>
      
      {/* Dynamic Success / Error Action Overlays */}
      {actionSuccessMessage && (
        <div className="fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-sm text-emerald-200 font-medium">{actionSuccessMessage}</div>
        </div>
      )}
      {actionErrorMessage && (
        <div className="fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 p-4 bg-rose-950/90 border border-rose-500/50 rounded-xl shadow-[0_0_30px_rgba(244,63,94,0.2)] flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-sm text-rose-200 font-medium">{actionErrorMessage}</div>
        </div>
      )}

      {/* Top Header */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1A1A1C] bg-[#09090B]">
        <div className="flex items-center space-x-3 gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-800 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-medium tracking-tight text-white">{t[lang].appName}</h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#141416] border border-[#2A2A2C] rounded text-blue-500">v1.2</span>
            </div>
            <p className="text-xs text-[#555] font-light tracking-wide">{t[lang].appDesc}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 gap-3 md:gap-4">
          {/* System Status Pill */}
          <div className="hidden lg:flex items-center space-x-2 gap-2 text-xs uppercase tracking-wider text-[#666]">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></span>
            <span className="text-[#888] font-medium">
              {isConnected ? t[lang].connected : t[lang].disconnected}
              {isConnected && currentProfile?.isDemo && ` (${t[lang].demoSandbox})`}
            </span>
          </div>

          {/* Language Selector */}
          <button
            onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
            className="px-3.5 py-1.5 text-xs bg-[#121214] border border-[#232326] rounded-full hover:border-blue-500/50 transition-colors text-blue-400 font-mono font-bold flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'en' ? 'FA / 🇮🇷' : 'EN / 🇬🇧'}
          </button>

          {/* Quick Sandbox Mode Trigger */}
          <button
            onClick={() => {
              // Add a demo profile if not present and connect to it
              const demoInProfiles = profiles.find(p => p.isDemo);
              if (demoInProfiles) {
                setSelectedProfileId(demoInProfiles.id);
                triggerStatusOverlay("Switched to Demo Sandbox Mode.", 'success');
              } else {
                const newDemo: ServerProfile = {
                  id: 'demo-' + Date.now(),
                  name: 'Instant Demo Server Sandbox',
                  host: '127.0.0.1',
                  port: 443,
                  hubName: 'DEFAULT',
                  bypassSsl: true,
                  isDemo: true
                };
                saveAndSyncProfiles([...profiles, newDemo]);
                setSelectedProfileId(newDemo.id);
                triggerStatusOverlay("Simulated sandbox loaded.", 'success');
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-gradient-to-tr from-amber-650/10 via-[#1C160C] to-transparent border border-amber-500/20 text-amber-400 rounded-full hover:border-amber-500/60 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Demo Server</span>
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SECTION: Server Profiles list (w-80 equivalent) */}
          <aside className="lg:col-span-3 bg-[#0C0C0E] border border-[#1A1A1C] rounded-2xl p-5 flex flex-col min-h-[300px] shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1A1A1C]">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-slate-400">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                <span>{t[lang].personalServers}</span>
              </div>
              <button
                id="btn-add-profile"
                onClick={() => setShowAddModal(true)}
                className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t[lang].addNewServer}</span>
              </button>
            </div>

            {/* Profile Items Stack */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {profiles.length === 0 ? (
                <div className="text-center py-10 text-slate-600 text-xs text-light">
                  No configured servers. Click above to add your credentials.
                </div>
              ) : (
                profiles.map((p) => {
                  const isActive = p.id === selectedProfileId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProfileId(p.id)}
                      className={`group relative p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-[#121215] to-[#0D1017] border-blue-500/40 shadow-lg shadow-blue-950/10'
                          : 'bg-[#0F0F11] border-transparent hover:border-[#222] hover:bg-[#121214]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1 pb-1">
                        <span className={`text-xs md:text-sm font-semibold transition-colors ${isActive ? 'text-blue-400' : 'text-slate-300'}`}>
                          {p.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] px-1 rounded uppercase font-mono ${p.isDemo ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {p.isDemo ? 'DEMO' : 'LIVE'}
                          </span>
                          
                          {/* Profile Delete */}
                          <button
                            onClick={(e) => handleDeleteProfile(p.id, e)}
                            className="text-slate-600 hover:text-rose-400 transition-colors p-1 rounded hover:bg-slate-800/40 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono tracking-tight shrink-0 overflow-ellipsis overflow-hidden">
                        {p.host}:{p.port}
                      </p>
                      
                      {/* Live Tunnel Count Indicators */}
                      {isActive && isConnected && (
                        <div className="mt-2.5 pt-2 border-t border-[#1E1E22] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Users className="w-2.5 h-2.5 text-[#555]" />
                            <span>Hub: {selectedHub}</span>
                          </span>
                          <span>Active Tunnels: {sessionsList.length || 0}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-[#1A1A1C] text-slate-600 text-[11px] flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-blue-500/60" />
              <span>AES-256 Symmetric Encryption Tunneled</span>
            </div>
          </aside>

          {/* RIGHT / MAIN WORKSPACE AREA */}
          <main className="lg:col-span-9 flex flex-col gap-6">

            {/* If Connection is currently dead / testing */}
            {!isConnected ? (
              <div className="bg-[#0C0C0E] border border-[#1A1A1C] rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-xl">
                <div className="w-16 h-16 bg-[#121215] border border-blue-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                  <div className={`absolute inset-0 border border-blue-500 rounded-full animate-ping opacity-10 ${isConnecting ? 'block' : 'hidden'}`}></div>
                  <Wifi className={`w-8 h-8 ${isConnecting ? 'text-blue-500' : 'text-slate-600 animate-pulse'}`} />
                </div>
                
                <h3 className="text-xl font-light text-white mb-2">
                  {isConnecting ? t[lang].connecting : "SoftEther API Authentication Required"}
                </h3>
                
                <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
                  {connectionError 
                    ? connectionError 
                    : "Establish secure connection from browser to your SoftEther VPN JSON-RPC Management endpoint to control user credentials and download configs."}
                </p>

                {currentProfile ? (
                  <div className="p-4 bg-[#111114] border border-[#1C1C1F] rounded-xl text-left max-w-md w-full mb-8 font-mono text-xs">
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Server Host:</span>
                      <span className="text-slate-350 font-bold">{currentProfile.host}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Target API Port:</span>
                      <span className="text-slate-350">{currentProfile.port}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>SSL Check Bypass:</span>
                      <span className="text-blue-400">{currentProfile.bypassSsl ? "YES (Bypassed self-signed error)" : "NO"}</span>
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-4">
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting || !selectedProfileId}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-850 disabled:text-slate-500 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-blue-900/10 text-sm flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
                    <span>{isConnecting ? t[lang].connecting : "Connect Server"}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 bg-[#141416] border border-[#2B2B2E] text-slate-300 hover:border-slate-500 rounded-xl transition-all text-sm"
                  >
                    Configure Credentials
                  </button>
                </div>
              </div>
            ) : (
              // CONNECTED WORKSPACE ENGINE
              <>
                {/* 1. Header Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  
                  {/* Metric 1 */}
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-5 rounded-2xl flex flex-col justify-between">
                    <div className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-2">
                      {t[lang].serverProduct}
                    </div>
                    <div className="text-sm font-semibold text-slate-100 truncate">
                      {serverInfo?.ProductName_str || 'SoftEther VPN Server'}
                    </div>
                    <div className="text-[10px] font-mono text-blue-400 mt-1">
                      {serverInfo?.ProductVersion_str || 'Unknown v4.x'}
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-5 rounded-2xl flex flex-col justify-between">
                    <div className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-2">
                      {t[lang].serverOs}
                    </div>
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {serverInfo?.OsName_str || 'Linux 64-bit'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      Platform Type: {serverInfo?.OsType_u32 || 'Unknown'}
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-5 rounded-2xl flex flex-col justify-between">
                    <div className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-2">
                       {t[lang].cpuRAM}
                    </div>
                    <div className="text-sm font-mono font-semibold text-slate-100 flex justify-between">
                      <span>CPU: {serverStatus?.CpuUsage_u32 || 0}%</span>
                      <span className="text-slate-500">|</span>
                      <span>MEM: {serverStatus?.MemoryUsage_u64 ? (serverStatus.MemoryUsage_u64 / (1024 * 1024)).toFixed(0) : 0}MB</span>
                    </div>
                    <div className="w-full bg-[#1A1A1F] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(serverStatus?.CpuUsage_u32 || 5, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-5 rounded-2xl flex flex-col justify-between">
                    <div className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-2">
                       Active Hub
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white truncate max-w-[120px]">
                        Hub: {selectedHub}
                      </div>
                      <select
                        value={selectedHub}
                        onChange={(e) => setSelectedHub(e.target.value)}
                        className="bg-[#121215] border border-[#242428] rounded text-[10px] text-blue-400 font-mono px-1 py-0.5 focus:outline-none"
                      >
                        {hubsList.length > 0 ? (
                          hubsList.map(h => (
                            <option key={h.HubName_str} value={h.HubName_str}>{h.HubName_str}</option>
                          ))
                        ) : (
                          <option value="DEFAULT">DEFAULT</option>
                        )}
                      </select>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      Online: {hubStatus?.Online_bool ? 'YES' : 'NO'} | Tunnels: {sessionsList.length || 0}
                    </div>
                  </div>

                </div>

                {/* 2. Bandwidth Bezier Flowchart (Sophisticated Dark Pure SVG Visualization) */}
                <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                        Real-Time Server Traffic Throughput (Bytes Flow)
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Proxy sampling window: 1 second interval
                      </p>
                    </div>

                    <div className="flex space-x-4 gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" />
                        <span>{t[lang].inbound}: {(serverStatus?.InboundByteRate / 1024 || 0).toFixed(1)} KB/s</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-400">
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                        <span>{t[lang].outbound}: {(serverStatus?.OutboundByteRate / 1024 || 0).toFixed(1)} KB/s</span>
                      </div>
                    </div>
                  </div>

                  {/* Bezier Path Canvas */}
                  <div className="w-full h-24 relative mt-2">
                    {bandwidthHistory.length < 2 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-600">
                        Synchronizing active bandwidth pipelines...
                      </div>
                    ) : (
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* Gradients */}
                        <defs>
                          <linearGradient id="in-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                          </linearGradient>
                          <linearGradient id="out-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.20"/>
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                          </linearGradient>
                        </defs>

                        {/* Inbound Chart Line & Area */}
                        {(() => {
                          const width = 800; // arbitrary relative coords
                          const height = 96;
                          const maxVal = Math.max(...bandwidthHistory.map(d => d.inbound + d.outbound), 10);
                          const step = width / (bandwidthHistory.length - 1);
                          
                          let rawPoints = bandwidthHistory.map((d, i) => ({
                            x: i * step,
                            y: height - (d.inbound / maxVal) * (height - 10)
                          }));

                          let linePath = `M ${rawPoints[0].x} ${rawPoints[0].y}`;
                          for (let i = 1; i < rawPoints.length; i++) {
                            const prev = rawPoints[i - 1];
                            const curr = rawPoints[i];
                            const cpX1 = prev.x + step / 2;
                            const cpY1 = prev.y;
                            const cpX2 = curr.x - step / 2;
                            const cpY2 = curr.y;
                            linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
                          }

                          const areaPath = `${linePath} L ${rawPoints[rawPoints.length - 1].x} ${height} L ${rawPoints[0].x} ${height} Z`;

                          return (
                            <>
                              <path d={areaPath} fill="url(#in-grad)" />
                              <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            </>
                          );
                        })()}

                        {/* Outbound Chart Line & Area */}
                        {(() => {
                          const width = 800;
                          const height = 96;
                          const maxVal = Math.max(...bandwidthHistory.map(d => d.inbound + d.outbound), 10);
                          const step = width / (bandwidthHistory.length - 1);
                          
                          let rawPoints = bandwidthHistory.map((d, i) => ({
                            x: i * step,
                            y: height - (d.outbound / maxVal) * (height - 10)
                          }));

                          let linePath = `M ${rawPoints[0].x} ${rawPoints[0].y}`;
                          for (let i = 1; i < rawPoints.length; i++) {
                            const prev = rawPoints[i - 1];
                            const curr = rawPoints[i];
                            const cpX1 = prev.x + step / 2;
                            const cpY1 = prev.y;
                            const cpX2 = curr.x - step / 2;
                            const cpY2 = curr.y;
                            linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
                          }

                          const areaPath = `${linePath} L ${rawPoints[rawPoints.length - 1].x} ${height} L ${rawPoints[0].x} ${height} Z`;

                          return (
                            <>
                              <path d={areaPath} fill="url(#out-grad)" />
                              <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
                            </>
                          );
                        })()}
                      </svg>
                    )}
                  </div>
                </div>

                {/* 3. Action Tabs navigation */}
                <div className="flex border-b border-[#1A1A1C] gap-2 overflow-x-auto shrink-0 select-none">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {t[lang].overview}
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'users'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t[lang].users}</span>
                    <span className="bg-[#1C1C1F] text-slate-400 border border-slate-700/50 rounded-full text-[10px] px-1.5 font-mono">
                      {usersList.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className={`py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'sessions'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>{t[lang].sessions}</span>
                    <span className="bg-[#1C1C1F] text-slate-400 border border-slate-700/50 rounded-full text-[10px] px-1.5 font-mono">
                      {sessionsList.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('protocols')}
                    className={`py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors ${
                      activeTab === 'protocols'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {t[lang].protocols}
                  </button>
                  <button
                    onClick={() => setActiveTab('wizard')}
                    className={`py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'wizard'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t[lang].wizard}</span>
                  </button>
                </div>

                {/* TAB WINDOW 1: OVERVIEW & GENERAL CONTROL */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Diagnostic list */}
                    <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-6 rounded-2xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-4 pb-2 border-b border-[#1A1A1C]">
                          Virtual Hub Diagnostics
                        </h4>
                        
                        <div className="space-y-3 font-mono text-xs text-slate-400">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Selected Hub:</span>
                            <span className="text-slate-200">{selectedHub}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Hub Status:</span>
                            <span className="text-emerald-500 font-bold">{hubStatus?.Online_bool ? 'ONLINE' : 'OFFLINE'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Total Profile Users:</span>
                            <span className="text-slate-200">{hubStatus?.NumUsers_u32 || 0} Account Records</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Live Active Tunnels:</span>
                            <span className="text-blue-400">{hubStatus?.NumSessions_u32 || 0} Sessions</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Active ARP IP Rows:</span>
                            <span className="text-slate-200">{hubStatus?.NumIpTables_u32 || 0} entries</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Virtual Hub Type:</span>
                            <span className="text-slate-200">Standalone Hub (Local)</span>
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic connection trigger portal */}
                      <div className="mt-8 pt-4 border-t border-[#1A1A1C] flex items-center justify-between">
                        <span className="text-xs text-slate-500">Sync Interval State:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              fetchServerDashboardData();
                              triggerStatusOverlay("Sync and diagnostics cached.", 'success');
                            }}
                            className="p-2 bg-[#121215] hover:bg-[#1A1A1F] border border-[#242426] rounded-xl text-xs text-slate-300 flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>{t[lang].refresh}</span>
                          </button>
                          
                          <select
                            value={refreshIntervalSec}
                            onChange={(e) => setRefreshIntervalSec(Number(e.target.value))}
                            className="bg-[#121215] border border-[#242426] text-xs text-slate-300 px-2 py-1.5 rounded-xl font-mono"
                          >
                            <option value={3}>3 sec</option>
                            <option value={5}>5 sec</option>
                            <option value={10}>10 sec</option>
                            <option value={30}>30 sec</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Quick Hub Statistics card */}
                    <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-6 rounded-2xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-4 pb-2 border-b border-[#1A1A1C]">
                          Total Network Volumetrics
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="py-3 px-4 bg-[#111113] border border-[#1E1E22] rounded-xl">
                            <span className="text-[10px] text-slate-500 block uppercase mb-1">Incoming Total volume</span>
                            <span className="text-sm font-semibold font-mono text-slate-200">
                              {serverStatus ? parseBytes(serverStatus.InboundBytes_u64) : '0 GB'}
                            </span>
                          </div>
                          
                          <div className="py-3 px-4 bg-[#111113] border border-[#1E1E22] rounded-xl">
                            <span className="text-[10px] text-slate-500 block uppercase mb-1">Outgoing Total volume</span>
                            <span className="text-sm font-semibold font-mono text-slate-200">
                              {serverStatus ? parseBytes(serverStatus.OutboundBytes_u64) : '0 GB'}
                            </span>
                          </div>
                          
                          <div className="py-3 px-4 bg-[#111113] border border-[#1E1E22] rounded-xl">
                            <span className="text-[10px] text-slate-500 block uppercase mb-1">Total Listeners</span>
                            <span className="text-sm font-semibold font-mono text-blue-400">
                              Active: 3 Ports
                            </span>
                          </div>
                          
                          <div className="py-3 px-4 bg-[#111113] border border-[#1E1E22] rounded-xl">
                            <span className="text-[10px] text-slate-500 block uppercase mb-1">Symmetric Cipher</span>
                            <span className="text-[11px] font-semibold text-slate-300 font-mono truncate">
                              AES-256-GCM / SHA384
                            </span>
                          </div>
                        </div>

                        {/* Interactive Server Operations */}
                        <div className="mt-6 flex flex-col gap-2">
                          <div className="text-[11px] text-slate-550 uppercase font-mono tracking-widest block">
                            Quick Operations Shortcut
                          </div>
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => {
                                // simulated or actual restart
                                const confirmed = confirm("Are you sure you want to request Reboot of the SoftEther VPN Server Service?");
                                if (confirmed) {
                                  if (currentProfile?.isDemo) {
                                    triggerStatusOverlay("Mock VPN service reboot scheduled.", 'success');
                                  } else {
                                    requestRpc('RebootServer', {}).then(() => {
                                      triggerStatusOverlay("Server reboot command initiated.", 'success');
                                      setIsConnected(false);
                                    }).catch(err => triggerStatusOverlay(err.message, 'error'));
                                  }
                                }
                              }}
                              className="flex-1 py-2 bg-[#1A1114] hover:bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 text-rose-400 rounded-xl text-xs transition-colors"
                            >
                              Soft Restart VPN Core
                            </button>
                            
                            <button
                              onClick={() => {
                                triggerStatusOverlay("Data persistent cache committed.", 'success');
                                if (!currentProfile?.isDemo) {
                                  requestRpc('Flush', {});
                                }
                              }}
                              className="flex-1 py-2 bg-[#111612] hover:bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 rounded-xl text-xs transition-colors"
                            >
                              Flush Log Buffer
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* TAB WINDOW 2: VPN USERS MANAGEMENT */}
                {activeTab === 'users' && (
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-6 rounded-2xl shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#1A1A1C]">
                      <div>
                        <h4 className="text-base font-semibold text-white">VPN User Credentials</h4>
                        <p className="text-xs text-slate-500">Virtual Hub: <span className="text-blue-500 font-bold">{selectedHub}</span></p>
                      </div>

                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-900/10"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t[lang].addUser}</span>
                      </button>
                    </div>

                    {/* Users list grid / table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-[#1E1E22] text-slate-500 uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">{t[lang].username}</th>
                            <th className="py-3 px-4">{t[lang].authType}</th>
                            <th className="py-3 px-4">Connections Status</th>
                            <th className="py-3 px-4">{t[lang].expires}</th>
                            <th className="py-3 px-4 text-right">Operation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#161619]">
                          {usersList.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-600 font-sans">
                                No user accounts found in Hub "{selectedHub}". Create one above.
                              </td>
                            </tr>
                          ) : (
                            usersList.map((user) => (
                              <tr key={user.Name_str} className="hover:bg-[#121214] transition-colors group">
                                <td className="py-3 px-4 font-semibold text-[#E0E0E0]">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    <span>{user.Name_str}</span>
                                    {user.Realname_str && (
                                      <span className="text-[10px] text-slate-550 font-sans font-light bg-[#121215] border border-[#232326] px-1.5 rounded">
                                        {user.Realname_str}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-400">
                                  {user.AuthType_u32 === 1 ? 'Standard Password' : user.AuthType_u32 === 4 ? 'RADIUS Authenticated' : 'Anonymous'}
                                </td>
                                <td className="py-3 px-4 text-slate-400">
                                  {user.NumConnections_u32 > 0 ? (
                                    <span className="text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                                      {t[lang].statusActive} ({user.NumConnections_u32})
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 bg-[#141416] border border-[#232326] px-2 py-0.5 rounded text-[10px]">
                                      {t[lang].statusOffline}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-500">
                                  {user.ExpirationDate_dt ? new Date(user.ExpirationDate_dt).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => handleDeleteUser(user.Name_str)}
                                    className="p-1 px-2.5 rounded bg-[#1C1113] hover:bg-rose-950/25 border border-rose-500/10 hover:border-rose-500/40 text-rose-400 transition-all font-sans text-[10px]"
                                  >
                                    Revoke
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB WINDOW 3: LIVE ACTIVE CONNECTIONS */}
                {activeTab === 'sessions' && (
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-6 rounded-2xl shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#1A1A1C]">
                      <div>
                        <h4 className="text-base font-semibold text-white">Live Connected Tunnels</h4>
                        <p className="text-xs text-slate-500">Active socket tunnels monitored internally on hub: <span className="text-blue-500 font-bold">{selectedHub}</span></p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                        <span>Online sessions: {sessionsList.length}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-[#1E1E22] text-slate-500 uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">{t[lang].sessionName}</th>
                            <th className="py-3 px-4">{t[lang].username}</th>
                            <th className="py-3 px-4">{t[lang].clientIp}</th>
                            <th className="py-3 px-4">Client Core Support</th>
                            <th className="py-3 px-4 text-right">Operation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#161619]">
                          {sessionsList.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-600 font-sans">
                                No active connected client sessions. Standard SSTP / L2TP tunnels are silent.
                              </td>
                            </tr>
                          ) : (
                            sessionsList.map((session) => (
                              <tr key={session.Name_str} className="hover:bg-[#121214] transition-colors">
                                <td className="py-3 px-4 text-blue-400 font-semibold truncate max-w-[200px]">
                                  {session.Name_str}
                                </td>
                                <td className="py-3 px-4 text-[#E0E0E0]">{session.Username_str}</td>
                                <td className="py-3 px-4 shrink-0 truncate max-w-[150px]">
                                  <span className="text-slate-350">{session.Ip_str}</span>
                                  {session.Hostname_str && (
                                    <span className="text-[10px] text-slate-600 block">{session.Hostname_str}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-400">
                                  <div className="flex items-center gap-1.5 text-[10px] bg-[#121215] border border-[#202022] rounded px-2 py-0.5 w-fit">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    <span>{session.ClientOsName_str || 'SSTP / Mobile'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => handleKickSession(session.Name_str)}
                                    className="p-1 px-2.5 rounded bg-[#1C1113] hover:bg-rose-950/20 border border-rose-500/10 hover:border-rose-500/40 text-rose-400 transition-all font-sans text-[10px]"
                                  >
                                    Disconnect
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB WINDOW 4: PROTOCOLS ACCELERATOR (L2TP/SSTP/OPENVPN CONFIGS) */}
                {activeTab === 'protocols' && (
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-6 rounded-2xl shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#1A1A1C]">
                      <div>
                        <h4 className="text-base font-semibold text-white">{t[lang].protocolsTitle}</h4>
                        <p className="text-xs text-slate-500">Edit core VPN parameters and key structures directly on the hardware daemon</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Left: General options */}
                      <div className="space-y-6">
                        {/* L2TP Toggle */}
                        <div className="p-4 bg-[#111113] border border-[#1F1F22] rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs uppercase font-bold text-slate-400">L2TP / IPsec Protocol</span>
                              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 rounded">Core-Engine</span>
                            </div>
                            <p className="text-[11px] text-slate-550 mr-4 font-sans mt-1">Allows modern smartphones to connect manually without setup packages.</p>
                          </div>
                          
                          <input
                            type="checkbox"
                            checked={isL2tpEnabled}
                            onChange={(e) => setIsL2tpEnabled(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-500 bg-[#1D1D22] border-[#2C2C32] focus:ring-0"
                          />
                        </div>

                        {/* OpenVPN Toggle */}
                        <div className="p-4 bg-[#111113] border border-[#1F1F22] rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs uppercase font-bold text-slate-400">OpenVPN Tunnel Listener</span>
                              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 rounded">Port 1194</span>
                            </div>
                            <p className="text-[11px] text-slate-550 mr-4 font-sans mt-1">Accepts standard cross-platform openvpn client connectivity files.</p>
                          </div>
                          
                          <input
                            type="checkbox"
                            checked={isOpenVpnEnabled}
                            onChange={(e) => setIsOpenVpnEnabled(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-500 bg-[#1D1D22] border-[#2C2C32] focus:ring-0"
                          />
                        </div>

                        {/* SSTP Toggle */}
                        <div className="p-4 bg-[#111113] border border-[#1F1F22] rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs uppercase font-bold text-slate-400">Microsoft SSTP Service</span>
                              <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 rounded">Port 443</span>
                            </div>
                            <p className="text-[11px] text-slate-550 mr-4 font-sans mt-1">Highly reliable fallback protocol utilizing HTTPS connections.</p>
                          </div>
                          
                          <input
                            type="checkbox"
                            checked={isSstpEnabled}
                            onChange={(e) => setIsSstpEnabled(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-500 bg-[#1D1D22] border-[#2C2C32] focus:ring-0"
                          />
                        </div>

                      </div>

                      {/* Right: Key parameter setups */}
                      <div className="space-y-6 bg-[#0E0E10] p-5 rounded-2xl border border-[#1E1E22]">
                        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                          Encryption & Key Cryptography Setup
                        </div>

                        {/* Preshared Key */}
                        <div>
                          <label className="block text-xs text-slate-400 font-mono mb-2">
                            {t[lang].presharedKey}
                          </label>
                          <div className="relative">
                            <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                            <input
                              type="text"
                              value={ipsecPresharedKey}
                              onChange={(e) => setIpsecPresharedKey(e.target.value)}
                              className="w-full bg-[#141416] border border-[#242426] rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500/50"
                              placeholder="e.g. vpn"
                            />
                          </div>
                        </div>

                        {/* OpenVPN Port List */}
                        <div>
                          <label className="block text-xs text-slate-400 font-mono mb-2">
                            {t[lang].openVpnPort}
                          </label>
                          <input
                            type="text"
                            value={openVpnPorts}
                            onChange={(e) => setOpenVpnPorts(e.target.value)}
                            disabled={!isOpenVpnEnabled}
                            className="w-full bg-[#141416] border border-[#242426] disabled:opacity-40 rounded-xl py-2 px-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500/50"
                            placeholder="e.g. 1194"
                          />
                        </div>

                        <div className="pt-4 border-t border-[#1C1C1F]">
                          <button
                            onClick={handleSaveProtocolConfigs}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg hover:shadow-blue-900/10 transition-colors"
                          >
                            {t[lang].saveProtocols}
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* TAB WINDOW 5: CONNECTIONS WIZARD & CONFIG STATIONS */}
                {activeTab === 'wizard' && (
                  <div className="bg-[#0C0C0E] border border-[#1A1A1C] p-6 rounded-2xl shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#1A1A1C]">
                      <div>
                        <h4 className="text-base font-semibold text-white">{t[lang].setupWizardTitle}</h4>
                        <p className="text-xs text-slate-500">{t[lang].setupWizardDesc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* SSTP Connector Block */}
                      <div className="p-5 bg-[#0F0F12] border border-[#1E1E22] rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                            <h5 className="text-sm font-semibold text-slate-200">Windows Native SSTP</h5>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed min-h-[50px]">
                            {t[lang].sstpDesc}
                          </p>

                          <div className="mt-4 p-3 bg-[#141416] border border-[#1E1E22] rounded-xl text-[11px] font-mono select-all">
                            <div className="text-slate-600">SSTP Server URL:</div>
                            <div className="text-slate-200 font-bold">{currentProfile?.host || '12.34.56.78'}</div>
                            <div className="text-slate-600 mt-2">Hub Selector:</div>
                            <div className="text-slate-200">{selectedHub}</div>
                          </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-[#1C1C1F] text-[10px] text-slate-600">
                          Connect protocols through standard Network & Sharing center.
                        </div>
                      </div>

                      {/* L2TP IPsec Connector Block */}
                      <div className="p-5 bg-[#0F0F12] border border-[#1E1E22] rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"></span>
                            <h5 className="text-sm font-semibold text-slate-200">L2TP / IPsec Tunneling</h5>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed min-h-[50px]">
                            {t[lang].l2tpDesc}
                          </p>

                          <div className="mt-4 p-3 bg-[#141416] border border-[#1E1E22] rounded-xl text-[11px] font-mono">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Server Host:</span>
                              <span className="text-slate-200 select-all font-bold">{currentProfile?.host || '12.34.56.78'}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-slate-600">IPsec PSK Key:</span>
                              <span className="text-blue-400 select-all font-bold">{ipsecPresharedKey}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-slate-600">Hub:</span>
                              <span className="text-slate-200">{selectedHub}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-[#1C1C1F] text-[10px] text-slate-600">
                          Compatible with Windows, Android, macOS, and iOS natively.
                        </div>
                      </div>

                      {/* OpenVPN Direct Downloader Block */}
                      <div className="p-5 bg-[#0F0F12] border border-[#1E1E22] rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            <h5 className="text-sm font-semibold text-slate-200">OpenVPN Connection File (.ovpn)</h5>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed min-h-[50px]">
                            Generate a customized cross-platform config package with embedded security assets instantly.
                          </p>

                          <button
                            onClick={downloadOvpnFile}
                            className="w-full mt-4 py-2.5 bg-[#191510] hover:bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/50 text-amber-500 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Client Config</span>
                          </button>
                        </div>

                        <div className="mt-6 pt-3 border-t border-[#1C1C1F] text-[10px] text-slate-600">
                          Import on OpenVPN Connect across any client device safely.
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* POPUP: ADD SOFTETHER VPN SERVER CONFIGURATION MODAL */}
      {showAddModal && (
        <div id="add-profile-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in duration-300">
          <div className="relative bg-[#0C0C0E] border border-[#1A1A1C] w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 animate-in scale-in duration-200">
            
            <button
              id="btn-close-modal"
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              <span>{t[lang].addServerTitle}</span>
            </h3>

            <form onSubmit={handleAddProfile} className="space-y-4">
              
              {/* Profile Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {t[lang].profileName}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frankfurt Main Server"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-[#121214] border border-[#232326] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Host and Port Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    {t[lang].serverIpHost} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. vpn.myhost.com"
                    value={newProfileHost}
                    onChange={(e) => setNewProfileHost(e.target.value)}
                    className="w-full bg-[#121214] border border-[#232326] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    {t[lang].serverPort} *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProfilePort}
                    onChange={(e) => setNewProfilePort(Number(e.target.value))}
                    className="w-full bg-[#121214] border border-[#232326] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {t[lang].adminPassword}
                </label>
                <input
                  type="password"
                  placeholder="Leave blank if no admin password is set"
                  value={newProfilePassword}
                  onChange={(e) => setNewProfilePassword(e.target.value)}
                  className="w-full bg-[#121214] border border-[#232326] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
                />
              </div>

              {/* Default Hub Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {t[lang].virtualHub}
                </label>
                <input
                  type="text"
                  placeholder="DEFAULT"
                  value={newProfileHub}
                  onChange={(e) => setNewProfileHub(e.target.value)}
                  className="w-full bg-[#121214] border border-[#232326] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
                />
              </div>

              {/* Checkbox bypass SSL */}
              <div className="flex items-center space-x-2 gap-2 py-1">
                <input
                  type="checkbox"
                  id="chk-bypass"
                  checked={newProfileBypassSsl}
                  onChange={(e) => setNewProfileBypassSsl(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 bg-[#1D1D22] border-[#2C2C32] focus:ring-0"
                />
                <label htmlFor="chk-bypass" className="text-[11px] text-slate-400 select-none cursor-pointer leading-tight">
                  {t[lang].bypassCertificate}
                </label>
              </div>

              {/* Checkbox run in Demo mock Sandbox */}
              <div className="flex items-center space-x-2 gap-2 py-1">
                <input
                  type="checkbox"
                  id="chk-demo"
                  checked={newProfileIsDemo}
                  onChange={(e) => setNewProfileIsDemo(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 bg-[#1D1D22] border-[#2C2C32] focus:ring-0"
                />
                <label htmlFor="chk-demo" className="text-[11px] text-amber-400 font-bold select-none cursor-pointer leading-tight">
                  {t[lang].sandboxProfile}
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C1C1F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#141416] border border-[#232326] text-slate-400 hover:text-white rounded-xl text-xs"
                >
                  {t[lang].cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {t[lang].save}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* POPUP: ADD USER CREDENTIAL RECORDS MODAL */}
      {showAddUserModal && (
        <div id="add-user-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in duration-300">
          <div className="bg-[#121215] border border-[#232326] w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-white mb-6">
              Create VPN Account record
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  VPN Account {t[lang].username}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ali_reza"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value.trim())}
                  className="w-full bg-[#141416] border border-[#242426] rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Credentials {t[lang].password}
                </label>
                <input
                  type="password"
                  required={newUserAuthType === 'password'}
                  placeholder="••••••••"
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                  className="w-full bg-[#141416] border border-[#242426] rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Auth Type
                </label>
                <select
                  value={newUserAuthType}
                  onChange={(e) => setNewUserAuthType(e.target.value as any)}
                  className="w-full bg-[#141416] border border-[#242426] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="password">Standard Local Password Auth</option>
                  <option value="radius">RADIUS Server Delegation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  User description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Reza's Android Connection"
                  value={newUserNote}
                  onChange={(e) => setNewUserNote(e.target.value)}
                  className="w-full bg-[#141416] border border-[#242426] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="pt-4 border-t border-[#1C1C1F] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-[#18181B] border border-[#232326] text-xs text-slate-400 rounded-xl"
                >
                  {t[lang].cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                >
                  Generate User
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
