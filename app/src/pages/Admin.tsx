import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Trash2,
  ArrowLeft,
  Flower2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [isLoading, user, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone flex items-center justify-center">
        <div className="animate-pulse font-serif text-rose-deep">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-stone flex">
      {/* Sidebar */}
      <aside className="w-56 bg-rose-deep text-white flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="p-6">
          <Link to="/" className="font-serif text-xl text-white">
            Velvet Rose
          </Link>
          <p className="text-xs text-white/50 mt-1">Admin Panel</p>
        </div>
        <nav className="px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Dashboard" active />
          <SidebarItem icon={<Package size={16} />} label="Products" />
          <SidebarItem icon={<ShoppingCart size={16} />} label="Orders" />
          <SidebarItem icon={<Users size={16} />} label="Users" />
          <SidebarItem icon={<Mail size={16} />} label="Messages" />
        </nav>
        <div className="absolute bottom-6 left-4 right-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-serif text-3xl text-rose-deep mb-8">Dashboard</h1>

          {/* Stats */}
          <StatsCards />

          {/* Products Table */}
          <div className="mt-10">
            <h2 className="font-serif text-xl text-rose-deep mb-4">Products</h2>
            <ProductsTable />
          </div>

          {/* Orders Table */}
          <div className="mt-10">
            <h2 className="font-serif text-xl text-rose-deep mb-4">Orders</h2>
            <OrdersTable />
          </div>

          {/* Contact Messages */}
          <div className="mt-10">
            <h2 className="font-serif text-xl text-rose-deep mb-4">Contact Messages</h2>
            <MessagesTable />
          </div>

          {/* Users Table */}
          <div className="mt-10">
            <h2 className="font-serif text-xl text-rose-deep mb-4">Users</h2>
            <UsersTable />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
        active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatsCards() {
  const { data: products } = trpc.product.list.useQuery();
  const { data: orders } = trpc.order.adminList.useQuery(undefined, { enabled: true });
  const { data: users } = trpc.user.list.useQuery(undefined, { enabled: true });
  const { data: messages } = trpc.contact.list.useQuery(undefined, { enabled: true });

  const stats = [
    { label: "Total Products", value: products?.length ?? 0, icon: <Flower2 size={20} /> },
    { label: "Total Orders", value: orders?.length ?? 0, icon: <ShoppingCart size={20} /> },
    { label: "Total Users", value: users?.length ?? 0, icon: <Users size={20} /> },
    { label: "Messages", value: messages?.length ?? 0, icon: <Mail size={20} /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl border border-borderMuted p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-rose-coral">{stat.icon}</span>
          </div>
          <p className="text-2xl font-serif text-rose-deep">{stat.value}</p>
          <p className="text-xs text-foreground/50 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ProductsTable() {
  const { data: products } = trpc.product.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      toast.success("Product deleted");
    },
  });

  return (
    <div className="bg-white rounded-xl border border-borderMuted overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-cream/50">
            <tr>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Image</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Name</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Price</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Stock</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-t border-borderMuted/30 hover:bg-stone/50">
                <td className="px-4 py-3">
                  <img
                    src={product.imageUrl || "/images/products/eternal-rose.jpg"}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-rose-coral">${(product.price / 100).toFixed(2)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteMutation.mutate({ id: product.id })}
                    className="text-foreground/40 hover:text-rose-deep transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTable() {
  const { data: orders } = trpc.order.adminList.useQuery();

  return (
    <div className="bg-white rounded-xl border border-borderMuted overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-cream/50">
            <tr>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Order ID</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Customer</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Total</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Status</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-t border-borderMuted/30 hover:bg-stone/50">
                <td className="px-4 py-3 font-medium">#{order.id}</td>
                <td className="px-4 py-3">User #{order.userId}</td>
                <td className="px-4 py-3 text-rose-coral">${(order.total / 100).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "processing" ? "bg-blue-100 text-blue-700" :
                    order.status === "shipped" ? "bg-green-100 text-green-700" :
                    order.status === "delivered" ? "bg-gray-100 text-gray-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground/50">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesTable() {
  const { data: messages } = trpc.contact.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      toast.success("Message deleted");
    },
  });

  return (
    <div className="bg-white rounded-xl border border-borderMuted overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-cream/50">
            <tr>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Name</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Email</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Subject</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Message</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages?.map((msg) => (
              <tr key={msg.id} className="border-t border-borderMuted/30 hover:bg-stone/50">
                <td className="px-4 py-3 font-medium">{msg.name}</td>
                <td className="px-4 py-3 text-foreground/60">{msg.email}</td>
                <td className="px-4 py-3">{msg.subject || "-"}</td>
                <td className="px-4 py-3 max-w-[200px] truncate">{msg.message}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteMutation.mutate({ id: msg.id })}
                    className="text-foreground/40 hover:text-rose-deep transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTable() {
  const { data: users } = trpc.user.list.useQuery();

  return (
    <div className="bg-white rounded-xl border border-borderMuted overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-cream/50">
            <tr>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Name</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Email</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Role</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-foreground/60">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-t border-borderMuted/30 hover:bg-stone/50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-foreground/60">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin" ? "bg-rose-cream text-rose-deep" : "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground/50">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
