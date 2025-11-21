import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Send, User, Monitor, TrendingUp } from 'lucide-react';

// *** สำคัญ: วาง URL ที่ได้จาก Google Apps Script ตรงนี้ ***
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyHJKsf_LJQDdQginec6ixS7DkjC1Q5ve5dAAU5lfz0hTla5eD0a_lS-Vif_xXZn1JiQ/exec"; 

const App = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  // ข้อมูลคำถาม (ดึงมาจากไฟล์ PDF ของคุณ)
  const questions = [
    {
      id: 'part1',
      title: 'ส่วนที่ 1: ข้อมูลส่วนบุคคล',
      icon: <User className="w-6 h-6" />,
      description: 'ข้อมูลของท่านจะถูกเก็บเป็นความลับและใช้เพื่อการวิจัยเท่านั้น',
      fields: [
        {
          id: 'Gender',
          label: 'เพศ',
          type: 'radio',
          options: ['ชาย', 'หญิง', 'อื่นๆ (ไม่ประสงค์ระบุ)']
        },
        {
          id: 'Age',
          label: 'อายุ (ปี)',
          type: 'radio',
          options: ['20-30 ปี', '31-40 ปี', '41-50 ปี', '51 ปีขึ้นไป']
        },
        {
          id: 'Education',
          label: 'ระดับการศึกษาสูงสุด',
          type: 'radio',
          options: ['ต่ำกว่าปริญญาตรี', 'ปริญญาตรี', 'สูงกว่าปริญญาตรี']
        },
        {
          id: 'PositionType',
          label: 'ประเภทตำแหน่งงาน',
          type: 'radio',
          options: ['ข้าราชการกรุงเทพมหานครสามัญ', 'บุคลากรกรุงเทพมหานคร', 'อื่นๆ']
        },
        {
          id: 'JobFunction',
          label: 'สายงานหลักที่ปฏิบัติในปัจจุบัน (ตามโครงสร้างสำนักดิจิทัล)',
          type: 'radio',
          options: [
            'สายงานบริหารงานทั่วไป / ธุรการ / สนับสนุน (Others)',
            'สายงานนโยบายและแผน / ยุทธศาสตร์ / วิชาการ (Academic)',
            'สายงานเทคโนโลยีสารสนเทศ / พัฒนาระบบ (Technologist)',
            'อื่นๆ'
          ]
        }
      ]
    },
    {
      id: 'part2',
      title: 'ส่วนที่ 2: ทักษะด้านดิจิทัลที่จำเป็น',
      icon: <Monitor className="w-6 h-6" />,
      description: 'ประเมินระดับทักษะของท่าน (5 = มากที่สุด, 1 = น้อยที่สุด)',
      type: 'likert',
      questions: [
        { id: 'S2_Cap_1', text: 'ท่านสามารถประยุกต์ใช้เครื่องมือดิจิทัลพื้นฐาน (Office, Google Workspace) เพื่อเพิ่มประสิทธิภาพงานประจำ' },
        { id: 'S2_Cap_2', text: 'ท่านมีความสามารถในการบริหารจัดการข้อมูลและจัดทำชุดข้อมูลเปิด (Open Data)' },
        { id: 'S2_Know_1', text: 'ท่านมีความรู้ด้านความมั่นคงปลอดภัยไซเบอร์ (Cyber Security) และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)' },
        { id: 'S2_Know_2', text: 'ท่านมีความรู้เกี่ยวกับเป้าหมายและพันธกิจดิจิทัลของสำนักดิจิทัล กทม.' },
        { id: 'S2_Exp_1', text: 'ท่านมีประสบการณ์การใช้ข้อมูล (Data) เพื่อการวิเคราะห์และตัดสินใจ' },
        { id: 'S2_Exp_2', text: 'ท่านมีประสบการณ์การทำงานแบบคล่องตัว (Agile) หรือการใช้เครื่องมือ Collaboration' },
        { id: 'S2_Att_1', text: 'ท่านพร้อมเปิดรับเทคโนโลยีใหม่ๆ และเรียนรู้ด้วยตนเอง' },
        { id: 'S2_Att_2', text: 'ท่านกล้าตัดสินใจและรับผิดชอบต่อความเสี่ยงในการพัฒนางานดิจิทัล' }
      ]
    },
    {
      id: 'part3',
      title: 'ส่วนที่ 3: ประสิทธิภาพการปฏิบัติงาน',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'ประเมินผลการปฏิบัติงานของท่าน (5 = เห็นด้วยมากที่สุด, 1 = เห็นด้วยน้อยที่สุด)',
      type: 'likert',
      questions: [
        { id: 'S3_Quant_1', text: 'ท่านสามารถปฏิบัติงานได้สำเร็จครบถ้วนตามปริมาณงานที่ได้รับมอบหมาย' },
        { id: 'S3_Quant_2', text: 'ท่านบริหารจัดการงานไม่ให้เกิดงานคั่งค้างโดยใช้เครื่องมือดิจิทัลช่วย' },
        { id: 'S3_Qual_1', text: 'ผลงานของท่านมีความถูกต้องตามระเบียบและมาตรฐานดิจิทัล' },
        { id: 'S3_Qual_2', text: 'ผลงานมีความผิดพลาดน้อย (Low Error Rate) เมื่อนำเทคโนโลยีมาช่วย' },
        { id: 'S3_Speed_1', text: 'ท่านปฏิบัติงานได้เสร็จทันตามกำหนดเวลา (Deadline)' },
        { id: 'S3_Speed_2', text: 'ท่านตอบสนองต่อผู้รับบริการได้อย่างรวดเร็วผ่านช่องทางดิจิทัล' },
        { id: 'S3_Econ_1', text: 'ท่านใช้ทรัพยากร (กระดาษ, งบประมาณ) อย่างคุ้มค่าโดยใช้ระบบดิจิทัลทดแทน' },
        { id: 'S3_Econ_2', text: 'กระบวนการทำงานของท่านลดความซ้ำซ้อนและขั้นตอนที่ไม่จำเป็น' }
      ]
    }
  ];

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // แปลงข้อมูลเป็น FormData สำหรับส่งไป Google Script
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    formDataToSend.append("Timestamp", new Date().toISOString());

    try {
      // หมายเหตุ: ในการใช้งานจริง ต้องใช้ URL ที่ได้จากการ Deploy Google Apps Script
      // เนื่องจากการยิงข้ามโดเมน (CORS) อาจจะต้องใช้ mode: 'no-cors' และจะไม่ได้รับ response กลับมาในบางกรณี
      
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors' // สำคัญสำหรับ Google Apps Script Web App
      });

      // สมมติว่าส่งสำเร็จเสมอเพราะ no-cors ไม่คืนค่า error
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
      }, 1000);

    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล โปรดลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    const currentPart = questions[step];
    if (currentPart.fields) {
      // ตรวจสอบว่าตอบครบทุกข้อใน Part 1 หรือไม่
      return currentPart.fields.every(field => formData[field.id]);
    }
    if (currentPart.questions) {
      // ตรวจสอบว่าตอบครบทุกข้อใน Part 2, 3 หรือไม่
      return currentPart.questions.every(q => formData[q.id]);
    }
    return true;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">บันทึกข้อมูลเรียบร้อย</h2>
          <p className="text-gray-600 mb-6">ขอบคุณสำหรับข้อมูลอันเป็นประโยชน์ต่องานวิจัยสำนักดิจิทัล กทม.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            ทำแบบสอบถามใหม่
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-gray-900">แบบสอบถามงานวิจัย</h1>
              <p className="text-xs text-gray-500">สำนักดิจิทัลกรุงเทพมหานคร</p>
            </div>
          </div>
          <div className="text-sm font-medium text-indigo-600">
            หน้า {step + 1} / {questions.length}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 w-full">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 pb-24">
        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-indigo-50 p-6 border-b border-indigo-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                {currentQuestion.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{currentQuestion.title}</h2>
            </div>
            <p className="text-gray-600 text-sm ml-14">{currentQuestion.description}</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Render Radio Fields (Part 1) */}
            {currentQuestion.fields && currentQuestion.fields.map((field) => (
              <div key={field.id} className="space-y-3">
                <label className="block font-semibold text-gray-700 text-base">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <div className="grid gap-3 sm:grid-cols-1">
                  {field.options.map((option) => (
                    <label 
                      key={option}
                      className={`
                        flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${formData[field.id] === option 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50 text-gray-600'}
                      `}
                    >
                      <input
                        type="radio"
                        name={field.id}
                        value={option}
                        checked={formData[field.id] === option}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Render Likert Scale (Part 2 & 3) */}
            {currentQuestion.type === 'likert' && currentQuestion.questions.map((q, idx) => (
              <div key={q.id} className={`pb-6 border-b border-gray-100 last:border-0`}>
                <p className="font-medium text-gray-800 mb-4 text-base leading-relaxed">
                  {idx + 1}. {q.text} <span className="text-red-500">*</span>
                </p>
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center bg-gray-50 p-3 rounded-lg">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label key={score} className="flex flex-row sm:flex-col items-center cursor-pointer group p-2">
                      <input
                        type="radio"
                        name={q.id}
                        value={score}
                        checked={String(formData[q.id]) === String(score)}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-6 h-6 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 sm:ml-0 sm:mt-2 text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">
                        {score} 
                        <span className="sm:hidden text-xs text-gray-400 ml-2">
                          {score === 1 ? '(น้อยที่สุด)' : score === 5 ? '(มากที่สุด)' : ''}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                <div className="hidden sm:flex justify-between px-4 mt-2 text-xs text-gray-400">
                  <span>น้อยที่สุด</span>
                  <span>มากที่สุด</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0 || isSubmitting}
            className={`flex items-center px-4 py-2 text-gray-600 font-medium rounded-lg transition-colors
              ${step === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-100'}
            `}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ย้อนกลับ
          </button>

          {step < questions.length - 1 ? (
            <button
              onClick={() => setStep(s => Math.min(questions.length - 1, s + 1))}
              disabled={!isStepValid()}
              className={`flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-all
                ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-lg active:scale-95'}
              `}
            >
              ถัดไป
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className={`flex items-center px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md transition-all
                ${(!isStepValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700 hover:shadow-lg active:scale-95'}
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังส่งข้อมูล...
                </span>
              ) : (
                <span className="flex items-center">
                  ส่งแบบสอบถาม
                  <Send className="w-5 h-5 ml-2" />
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;