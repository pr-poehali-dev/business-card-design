import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const BusinessCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [phone, setPhone] = useState('+7 (XXX) XXX-XX-XX');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  const exportToPNG = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;
    
    setIsExporting(true);
    toast.info('Создаю PNG...');
    
    try {
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
      });
      
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
      });

      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) return;

      combinedCanvas.width = frontCanvas.width;
      combinedCanvas.height = frontCanvas.height + backCanvas.height + 60;
      
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      
      ctx.drawImage(frontCanvas, 0, 0);
      ctx.drawImage(backCanvas, 0, frontCanvas.height + 60);

      const link = document.createElement('a');
      link.download = 'arsego-business-card.png';
      link.href = combinedCanvas.toDataURL('image/png');
      link.click();

      toast.success('PNG скачан!');
    } catch (error) {
      toast.error('Ошибка экспорта PNG');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;
    
    setIsExporting(true);
    toast.info('Создаю PDF...');
    
    try {
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
      });
      
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [90, 50],
      });

      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', 0, 0, 90, 50);

      pdf.addPage([90, 50], 'landscape');
      const backImgData = backCanvas.toDataURL('image/png');
      pdf.addImage(backImgData, 'PNG', 0, 0, 90, 50);

      pdf.save('arsego-business-card.pdf');
      toast.success('PDF скачан!');
    } catch (error) {
      toast.error('Ошибка экспорта PDF');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Визитка ARSEGO</h1>
          <p className="text-slate-600">Нажмите на визитку, чтобы перевернуть</p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-4">
          <label className="text-sm font-medium text-slate-700">Номер телефона:</label>
          <Input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={() => setIsEditingPhone(true)}
            onBlur={() => setIsEditingPhone(false)}
            className="w-64 text-center"
            placeholder="+7 (XXX) XXX-XX-XX"
          />
        </div>

        <div className="mb-6 flex items-center justify-center gap-4">
          <Button 
            onClick={exportToPNG} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Icon name="Download" size={16} />
            Скачать PNG
          </Button>
          <Button 
            onClick={exportToPDF} 
            disabled={isExporting}
            className="flex items-center gap-2"
            variant="secondary"
          >
            <Icon name="FileDown" size={16} />
            Скачать PDF
          </Button>
        </div>

        <div 
          className="perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={`relative w-full transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ 
              aspectRatio: '90 / 50',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <Card 
              ref={frontCardRef}
              className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-slate-700 shadow-2xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="h-full p-8 flex flex-col">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-3 border-2 border-white rounded-lg px-4 py-2">
                    <Icon name="Brush" className="text-white" size={20} />
                    <Icon name="Droplet" className="text-white" size={20} />
                    <Icon name="FlaskConical" className="text-white" size={20} />
                  </div>
                  <h2 className="text-4xl font-bold text-white ml-4">ARSEGO</h2>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Icon name="Brush" className="text-white" size={28} />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm">Ремонт под ключ</h3>
                    <ul className="text-xs text-white/90 space-y-1">
                      <li>Ремонт по дизайн проекту</li>
                      <li>Предпродажная подготовка</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Icon name="Droplet" className="text-white" size={28} />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm">Клининг и химчистка</h3>
                    <ul className="text-xs text-white/90 space-y-1">
                      <li>Генеральная уборка</li>
                      <li>Чистка мебели</li>
                      <li>Мойка окон</li>
                      <li>Уборка после ремонта</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Icon name="FlaskConical" className="text-white" size={28} />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm">Поставка профессиональной химии</h3>
                    <ul className="text-xs text-white/90 space-y-1">
                      <li>HoReCa</li>
                      <li>Прачечные</li>
                      <li>Клининговые компании</li>
                    </ul>
                  </div>
                </div>

                <div className="text-center border-t border-white/30 pt-4">
                  <div className="flex items-center justify-center gap-3 text-sm text-white mb-2">
                    <Icon name="Phone" size={18} className="text-white" />
                    <span className="font-medium">{phone}</span>
                  </div>
                  <p className="text-xs text-white/80 italic">Комплексные решения для вашего пространства</p>
                </div>
              </div>
            </Card>

            <Card 
              ref={backCardRef}
              className="absolute inset-0 backface-hidden bg-white shadow-2xl"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="h-full p-8 flex flex-col">
                <div className="mb-6 pb-4 border-b text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">ARSEGO</h3>
                  <p className="text-xs text-slate-500">10 лет на рынке • 500+ проектов</p>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Ремонт под ключ</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Ремонт по дизайн проекту</li>
                      <li>• Предпродажная подготовка</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2">Клининг и химчистка</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Генеральная уборка</li>
                      <li>• Чистка мебели</li>
                      <li>• Мойка окон</li>
                      <li>• Уборка после ремонта</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2">Химия для бизнеса</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Моющие средства</li>
                      <li>• Профессиональные средства</li>
                      <li>• Оборудование</li>
                      <li>• Расходные материалы</li>
                      <li>• Консультации по выбору</li>
                      <li>• Оптовые поставки</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-center pt-4 border-t">
                  <div className="text-center text-slate-600">
                    <p className="font-semibold mb-1 flex items-center justify-center gap-2">
                      <Icon name="Phone" size={16} className="text-primary" />
                      {phone}
                    </p>
                    <p className="text-xs text-slate-500">Звоните с 9:00 до 21:00</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg shadow">
            <Icon name="Info" size={16} className="text-primary" />
            <span>Размер: 90×50 мм • Мелованная бумага 300 г/м²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
