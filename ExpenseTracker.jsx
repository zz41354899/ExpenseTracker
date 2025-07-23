import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="w-full md:w-auto" 
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>支出記錄</CardTitle>
              <CardDescription>
                {expenses.length > 0 
                  ? `共 ${expenses.length} 筆記錄，按時間排序` 
                  : '尚無支出記錄'
                }
              </CardDescription>
            </div>
            {expenses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('確定要清除所有記帳資料嗎？此操作無法復原！')) {
                    setExpenses([]);
                  }
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空全部
              </Button>
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
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{expense.name}</h3>
                      <Badge variant="outline" className="text-xs">
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
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
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