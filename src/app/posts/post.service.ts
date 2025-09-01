import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  public updatedPosts = this.postsUpdated.asObservable();
  constructor() { }

  getPosts() {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }

}
