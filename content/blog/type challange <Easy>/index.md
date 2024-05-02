---
title: type challange <Easy>
date: "2022-11-13"
description: "타입 챌린지 easy 풀이"
---

## Pick 
  
```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}
 
type TodoPreview = MyPick<Todo, 'title' | 'completed'>
 
const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

