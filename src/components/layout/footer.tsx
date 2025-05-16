import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-neutral-900 pt-10 pb-5 border-t border-border dark:border-neutral-700">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-start">
            <Logo />
            <p className="mt-4 text-muted-foreground dark:text-neutral-300 text-sm">
              منصة إلكترونية تجمع البائعين والمشترين في مكان واحد، تقدم خدمات البيع والشراء بطريقة سهلة وآمنة.
            </p>
            <div className="flex space-x-4 space-x-reverse mt-4">
              <Link to="#" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground dark:text-white">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  التصنيفات
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  الإعلانات المميزة
                </Link>
              </li>
              <li>
                <Link to="/add-ad" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  أضف إعلانك
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  حسابي
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground dark:text-white">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground dark:text-neutral-300 hover:text-primary transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground dark:text-white">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground dark:text-neutral-300">info@arab-market-oasis.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground dark:text-neutral-300">+966 500 000 000</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-bold mb-2 text-foreground dark:text-white">تنزيل التطبيق</h4>
              <div className="flex gap-2">
                <Link to="#" className="bg-black text-white p-2 rounded-md flex items-center text-xs hover:opacity-80 transition">
                  <div className="ml-1">
                    <span className="block">Download on the</span>
                    <span className="font-bold text-sm">App Store</span>
                  </div>
                </Link>
                <Link to="#" className="bg-black text-white p-2 rounded-md flex items-center text-xs hover:opacity-80 transition">
                  <div className="ml-1">
                    <span className="block">GET IT ON</span>
                    <span className="font-bold text-sm">Google Play</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-10 pt-5 border-t border-gray-200 dark:border-neutral-700 text-center text-sm text-muted-foreground dark:text-neutral-400">
          <p>© {new Date().getFullYear()} واحة السوق العربي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
