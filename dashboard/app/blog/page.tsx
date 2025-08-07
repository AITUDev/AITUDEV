"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  publishDate: string
  status: 'draft' | 'published' | 'archived'
  views: number
  likes: number
  comments: number
  image: string
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'مستقبل الذكاء الاصطناعي في التطوير',
      excerpt: 'نظرة شاملة على كيفية تأثير الذكاء الاصطناعي على مجال تطوير البرمجيات والتقنيات الناشئة.',
      content: 'محتوى المقال الكامل هنا...',
      author: 'أحمد محمد',
      category: 'تقنية',
      tags: ['ذكاء اصطناعي', 'تطوير', 'تقنية'],
      publishDate: '2024-01-15',
      status: 'published',
      views: 1250,
      likes: 89,
      comments: 23,
      image: '/ai-development.png'
    },
    {
      id: '2',
      title: 'أفضل الممارسات في تطوير React',
      excerpt: 'دليل شامل لأفضل الممارسات والتقنيات المتقدمة في تطوير تطبيقات React الحديثة.',
      content: 'محتوى المقال الكامل هنا...',
      author: 'فاطمة علي',
      category: 'برمجة',
      tags: ['React', 'JavaScript', 'تطوير ويب'],
      publishDate: '2024-01-10',
      status: 'published',
      views: 980,
      likes: 67,
      comments: 15,
      image: '/react-best-practices.png'
    },
    {
      id: '3',
      title: 'تصميم واجهات المستخدم الحديثة',
      excerpt: 'استكشاف أحدث اتجاهات تصميم UI/UX وكيفية تطبيقها في المشاريع الحقيقية.',
      content: 'محتوى المقال الكامل هنا...',
      author: 'محمد حسن',
      category: 'تصميم',
      tags: ['UI/UX', 'تصميم', 'واجهات'],
      publishDate: '2024-01-05',
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      image: '/modern-ui-design.png'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    publishDate: '',
    status: 'draft' as BlogPost['status']
  })

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      tags: '',
      publishDate: '',
      status: 'draft'
    })
  }

  const handleAdd = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()),
      publishDate: formData.publishDate,
      status: formData.status,
      views: 0,
      likes: 0,
      comments: 0,
      image: `/placeholder.svg?height=200&width=300&query=${formData.title}`
    }
    setBlogPosts([...blogPosts, newPost])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      tags: post.tags.join(', '),
      publishDate: post.publishDate,
      status: post.status
    })
  }

  const handleUpdate = () => {
    if (!editingPost) return
    
    const updatedPost: BlogPost = {
      ...editingPost,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()),
      publishDate: formData.publishDate,
      status: formData.status
    }
    
    setBlogPosts(blogPosts.map(p => p.id === editingPost.id ? updatedPost : p))
    setEditingPost(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id))
  }

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: BlogPost['status']) => {
    switch (status) {
      case 'published': return 'منشور'
      case 'draft': return 'مسودة'
      case 'archived': return 'مؤرشف'
      default: return status
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'تقنية': 'bg-blue-100 text-blue-800',
      'برمجة': 'bg-purple-100 text-purple-800',
      'تصميم': 'bg-pink-100 text-pink-800',
      'أعمال': 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة المدونة</h1>
          <p className="text-gray-600">إدارة مقالات ومحتوى المدونة</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة مقال جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة مقال جديد</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان المقال</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="أدخل عنوان المقال"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">المقتطف</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="مقتطف قصير من المقال"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">المحتوى</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="محتوى المقال الكامل"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="author">الكاتب</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="اسم الكاتب"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="تصنيف المقال"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">الكلمات المفتاحية (مفصولة بفاصلة)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="تقنية, برمجة, تطوير"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="publishDate">تاريخ النشر</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value: BlogPost['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAdd}>إضافة المقال</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(post.category)}>
                  {post.category}
                </Badge>
                <Badge className={getStatusColor(post.status)}>
                  {getStatusText(post.status)}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.publishDate).toLocaleDateString('ar-SA')}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(post)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل المقال</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">عنوان المقال</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-excerpt">المقتطف</Label>
              <Textarea
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">المحتوى</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-author">الكاتب</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">التصنيف</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">الكلمات المفتاحية</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-publishDate">تاريخ النشر</Label>
                <Input
                  id="edit-publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">الحالة</Label>
                <Select value={formData.status} onValueChange={(value: BlogPost['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdate}>حفظ التغييرات</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
