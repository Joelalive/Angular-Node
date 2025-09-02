import { Injectable } from '@angular/core';
import { Post } from './post';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  public updatedPosts = this.postsUpdated.asObservable();
  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: any[]}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return { id: post._id, title: post.title, content: post.content };
        });
      }))   
      .subscribe((transformedPosts) => {
        console.log(transformedPosts);
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = {id: '', title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData);
        
        const id = responseData.postId;
        post.id = id;
        console.log(post);
        
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      }); 
  }

}
