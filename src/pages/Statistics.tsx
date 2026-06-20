import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BookOpen, CheckCircle, BookMarked, Star, TrendingUp, Award } from 'lucide-react';
import { useBookStore } from '@/store/useBookStore';
import {
  calculateMonthlyStats,
  calculateCategoryStats,
  calculateRatingStats,
  getOverviewStats,
  getRecentCompletedBooks
} from '@/utils/statistics';
import StatsCard from '@/components/StatsCard';
import { formatDate } from '@/utils/storage';

const CHART_COLORS = [
  '#8B5A2B',
  '#2D5A3D',
  '#C16651',
  '#A67B5B',
  '#558960',
  '#C97A63',
  '#6B4423',
  '#244831',
  '#833E30'
];

const MONTH_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

export default function Statistics() {
  const { books } = useBookStore();

  const overviewStats = useMemo(() => getOverviewStats(books), [books]);
  const monthlyStats = useMemo(() => calculateMonthlyStats(books), [books]);
  const categoryStats = useMemo(() => calculateCategoryStats(books), [books]);
  const ratingStats = useMemo(() => calculateRatingStats(books), [books]);
  const recentBooks = useMemo(() => getRecentCompletedBooks(books, 5), [books]);

  const currentYear = new Date().getFullYear();

  const monthlyChartData = MONTH_LABELS.map((month) => {
    const stat = monthlyStats.find((s) => s.month === month);
    const monthIndex = parseInt(month) - 1;
    return {
      month: MONTH_NAMES[monthIndex].replace('月', ''),
      已读: stat?.completed || 0,
      新增: stat?.added || 0
    };
  });

  const pieData = categoryStats.map((item) => ({
    name: item.category,
    value: item.count
  }));

  const ratingChartData = ratingStats.map((item) => ({
    rating: `${item.rating} 星`,
    count: item.count,
    fullMark: 5
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-soft-hover border border-brown-100 p-3">
          <p className="font-medium text-brown-800 mb-1">{label}月</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} 本
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / books.length) * 100).toFixed(1);
      return (
        <div className="bg-white rounded-xl shadow-soft-hover border border-brown-100 p-3">
          <p className="font-medium text-brown-800 mb-1">{payload[0].name}</p>
          <p className="text-sm text-brown-600">
            {payload[0].value} 本 ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 animate-fade-in">
          <h2 className="font-serif text-2xl font-bold text-brown-800 mb-2">
            阅读统计
          </h2>
          <p className="text-brown-500">追踪你的阅读进度，发现阅读偏好</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="总藏书量"
            value={overviewStats.total}
            icon={BookOpen}
            gradient="linear-gradient(135deg, #8B5A2B, #A67B5B)"
            subtitle="本书籍"
            delay={0}
          />
          <StatsCard
            title="已完成阅读"
            value={overviewStats.completed}
            icon={CheckCircle}
            gradient="linear-gradient(135deg, #C16651, #DBA08F)"
            subtitle={`占比 ${overviewStats.total > 0 ? Math.round((overviewStats.completed / overviewStats.total) * 100) : 0}%`}
            delay={100}
          />
          <StatsCard
            title="正在阅读"
            value={overviewStats.reading}
            icon={BookMarked}
            gradient="linear-gradient(135deg, #2D5A3D, #558960)"
            subtitle="进行中"
            delay={200}
          />
          <StatsCard
            title="平均评分"
            value={overviewStats.avgRating || '—'}
            icon={Star}
            gradient="linear-gradient(135deg, #C16651, #8B5A2B)"
            subtitle="满分 5.0"
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brown-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brown-600" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-brown-800">
                {currentYear}年月度阅读趋势
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8D9C7" vertical={false} />
                  <XAxis dataKey="month" stroke="#A67B5B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A67B5B" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-brown-600 text-sm">{value}</span>}
                  />
                  <Bar dataKey="已读" fill="#C16651" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="新增" fill="#8B5A2B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-forest-600" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-brown-800">
                分类分布
              </h3>
            </div>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      formatter={(value) => <span className="text-brown-600 text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-brown-400">
                暂无数据
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-terracotta-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-terracotta-500" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-brown-800">
                评分分布
              </h3>
            </div>
            {ratingChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8D9C7" horizontal={false} />
                    <XAxis type="number" stroke="#A67B5B" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis dataKey="rating" type="category" stroke="#A67B5B" fontSize={12} tickLine={false} axisLine={false} width={60} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white rounded-xl shadow-soft-hover border border-brown-100 p-3">
                              <p className="font-medium text-brown-800">{payload[0].payload.rating}</p>
                              <p className="text-sm text-brown-600">{payload[0].value} 本</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" fill="#C16651" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-brown-400">
                暂无评分数据
              </div>
            )}
          </div>

          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brown-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-brown-600" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-brown-800">
                最近读完
              </h3>
            </div>
            {recentBooks.length > 0 ? (
              <div className="space-y-3">
                {recentBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-brown-50 hover:bg-brown-100 transition-colors"
                    style={{ animationDelay: `${index * 50 + 400}ms` }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center text-white font-serif font-bold text-sm flex-shrink-0"
                    >
                      {book.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brown-800 truncate">{book.title}</p>
                      <p className="text-sm text-brown-500">{book.author}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-0.5 justify-end">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < book.rating ? 'text-terracotta-500 fill-terracotta-500' : 'text-brown-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-brown-400 mt-1">
                        {book.completedAt && formatDate(book.completedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-brown-400">
                暂无已完成的书籍
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
