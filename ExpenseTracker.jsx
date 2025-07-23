import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, DollarSign, Calendar, TrendingDown, Download, FileText } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import html2pdf from 'html2pdf.js';

const ExpenseTracker = () => {
  // 狀態管理
  const [expenses, setExpenses] = useState([]);
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');

  // 從 localStorage 載入資料
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error('載入記帳資料時發生錯誤:', error);
        setExpenses([]);
      }
    }
  }, []);

  // 儲存資料到 localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // 新增支出項目
  const addExpense = () => {
    // 驗證輸入
    if (!itemName.trim()) {
      alert('請輸入項目名稱！');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      alert('請輸入有效的金額！');
      return;
    }

    // 建立新的支出項目
    const newExpense = {
      id: Date.now(),
      name: itemName.trim(),
      amount: numericAmount,
      date: new Date().toLocaleDateString('zh-TW'),
      timestamp: new Date()
    };

    // 更新支出清單（最新的在前面）
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);

    // 清空輸入欄位
    setItemName('');
    setAmount('');
  };

  // 刪除支出項目
  const deleteExpense = (id) => {
    if (window.confirm('確定要刪除這個項目嗎？')) {
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    }
  };

  // 計算統計數據
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todayExpenses = expenses.filter(expense => {
    const today = new Date().toLocaleDateString('zh-TW');
    return expense.date === today;
  });
  const todayAmount = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // 處理 Enter 鍵提交
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addExpense();
    }
  };

  // 匯出 PDF 報表
  const exportToPDF = () => {
    if (expenses.length === 0) {
      alert('沒有支出記錄可以匯出！');
      return;
    }

    // 產生時間
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-TW');
    const timeStr = now.toLocaleTimeString('zh-TW');

    // 建立 HTML 內容
    const htmlContent = `
      <div style="font-family: 'Microsoft JhengHei', 'PingFang TC', 'Noto Sans CJK TC', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 28px;">💰 支出報表</h1>
          <p style="color: #666; margin: 0; font-size: 14px;">產生時間：${dateStr} ${timeStr}</p>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">📊 統計摘要</h2>
          <div style="display: grid; gap: 10px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #374151; font-weight: 500;">總支出金額：</span>
              <span style="color: #dc2626; font-weight: bold; font-size: 16px;">NT$ ${totalAmount.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #374151; font-weight: 500;">今日支出：</span>
              <span style="color: #ea580c; font-weight: bold;">NT$ ${todayAmount.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #374151; font-weight: 500;">支出項目總數：</span>
              <span style="color: #2563eb; font-weight: bold;">${expenses.length} 筆</span>
            </div>
          </div>
        </div>

        <div>
          <h2 style="color: #374151; margin-bottom: 15px; font-size: 18px;">📋 支出明細</h2>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #4f82b9; color: white;">
                <th style="padding: 12px 8px; text-align: center; border-right: 1px solid #6b94c4; font-weight: bold;">序號</th>
                <th style="padding: 12px; text-align: left; border-right: 1px solid #6b94c4; font-weight: bold;">項目名稱</th>
                <th style="padding: 12px; text-align: center; border-right: 1px solid #6b94c4; font-weight: bold;">日期</th>
                <th style="padding: 12px; text-align: right; font-weight: bold;">金額</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map((expense, index) => `
                <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'}; border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 8px; text-align: center; border-right: 1px solid #e5e7eb;">${index + 1}</td>
                  <td style="padding: 10px 12px; border-right: 1px solid #e5e7eb; font-weight: 500;">${expense.name}</td>
                  <td style="padding: 10px 12px; text-align: center; border-right: 1px solid #e5e7eb; color: #6b7280;">${expense.date}</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: bold; color: #dc2626;">NT$ ${expense.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            此報表由現代記帳工具自動產生 | 頁面共 1 頁
          </p>
        </div>
      </div>
    `;

    // 使用 html2pdf 轉換
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    const opt = {
      margin: 0.5,
      filename: `支出報表_${dateStr.replace(/\//g, '')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 標題區域 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Receipt className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            現代記帳工具
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">智能管理您的每一筆支出</p>
      </div>

             {/* 統計卡片 */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">總支出</CardTitle>
             <DollarSign className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-destructive">NT$ {totalAmount.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">累計支出金額</p>
           </CardContent>
         </Card>

         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">今日支出</CardTitle>
             <Calendar className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-orange-600">NT$ {todayAmount.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">今天的支出金額</p>
           </CardContent>
         </Card>

         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">支出項目</CardTitle>
             <TrendingDown className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-blue-600">{expenses.length}</div>
             <p className="text-xs text-muted-foreground">總記錄筆數</p>
           </CardContent>
         </Card>
       </div>

      {/* 新增支出表單 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            新增支出
          </CardTitle>
          <CardDescription>記錄您的最新支出項目</CardDescription>
        </CardHeader>
                 <CardContent className="space-y-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                項目名稱
              </label>
              <Input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="例如：午餐、交通費、購物..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                金額 (NT$)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="請輸入金額"
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>
          </div>

                     <Button 
             onClick={addExpense} 
             className="w-full sm:w-auto" 
             size="lg"
           >
            <Plus className="w-4 h-4 mr-2" />
            新增支出
          </Button>
        </CardContent>
      </Card>

             {/* 支出清單 */}
       <Card>
         <CardHeader>
           <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
             <div className="flex-1">
               <CardTitle>支出記錄</CardTitle>
               <CardDescription>
                 {expenses.length > 0 
                   ? `共 ${expenses.length} 筆記錄，按時間排序` 
                   : '尚無支出記錄'
                 }
               </CardDescription>
             </div>
             {expenses.length > 0 && (
               <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={exportToPDF}
                   className="text-primary hover:text-primary w-full sm:w-auto"
                 >
                   <Download className="w-4 h-4 mr-2" />
                   匯出PDF
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     if (window.confirm('確定要清除所有記帳資料嗎？此操作無法復原！')) {
                       setExpenses([]);
                     }
                   }}
                   className="text-destructive hover:text-destructive w-full sm:w-auto"
                 >
                   <Trash2 className="w-4 h-4 mr-2" />
                   清空全部
                 </Button>
               </div>
             )}
           </div>
         </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Receipt className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">還沒有任何支出記錄</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  開始記錄您的第一筆支出，讓我們幫您管理財務！
                </p>
              </div>
            </div>
          ) : (
                         <div className="space-y-3">
               {expenses.map((expense) => (
                 <div
                   key={expense.id}
                   className="flex flex-col space-y-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                 >
                   <div className="flex-1 space-y-2">
                     <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0">
                       <h3 className="font-medium text-base">{expense.name}</h3>
                       <Badge variant="outline" className="text-xs w-fit">
                         {expense.date}
                       </Badge>
                     </div>
                     <div className="flex items-center gap-2">
                       <DollarSign className="w-4 h-4 text-muted-foreground" />
                       <span className="text-lg font-semibold text-destructive">
                         NT$ {expense.amount.toLocaleString()}
                       </span>
                     </div>
                   </div>

                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => deleteExpense(expense.id)}
                     className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                   >
                     <Trash2 className="w-4 h-4 mr-2 sm:mr-0" />
                     <span className="sm:hidden">刪除</span>
                   </Button>
                 </div>
               ))}
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker; 