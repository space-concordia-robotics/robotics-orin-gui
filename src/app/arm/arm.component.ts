import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

@Component({
  selector: 'app-arm',
  standalone: true,
  imports: [],
  templateUrl: './arm.component.html',
  styleUrl: './arm.component.css'
})

export class ArmComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private stats: Stats;
  
  ngOnInit(): void {
    this.initThreeJS();
    this.loadModel();
  }

  ngAfterViewInit(): void {
    this.animate()
  }

  private initThreeJS(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // Camera
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize( window.innerWidth, window.innerHeight)
    this.renderer.setAnimationLoop(this.animate)
    document.body.appendChild(this.renderer.domElement)

    // Orbital controls, allows the camera to orbit around a target
    new OrbitControls(this.camera, this.renderer.domElement);

    // Stats panel, useful for seeing the performance
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }

  private loadModel(): void {
    const geometry = new THREE.BoxGeometry(2, 0.5, 1);
    const material = new THREE.MeshBasicMaterial( {color: 0x999999})
    const cube = new THREE.Mesh( geometry, material)
    this.scene.add(cube)
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render( this.scene, this.camera);
    this.stats.update();
  }
}
