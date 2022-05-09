import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass'],
})
export class GalleryComponent {
  currentIndex: any = -1;
  showFlag: any = false;

  imageObject: Array<object> = [
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 1',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 2',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 3',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 4',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 5',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 6',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 7',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 8',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 9',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 10',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 11',
    },
    {
      image: 'assets/images/image-gallery/1.png',
      thumbImage: 'assets/images/image-gallery/1.png',
      title: 'Image 12',
    },
  ];

  showLightbox(index) {
    this.currentIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
}
