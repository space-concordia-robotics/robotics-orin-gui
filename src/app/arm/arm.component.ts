import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { ConnectionInfoService } from '../services/connection-info.service';

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

  constructor (private connectionInfoService: ConnectionInfoService) {
  }
  
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
    this.connectionInfoService.getServerURL().then(serverURL => {
      // const geometry = new THREE.BoxGeometry(2, 0.5, 1);
      const material = new THREE.MeshBasicMaterial( {color: 0x999999})
      // const cube = new THREE.Mesh( geometry, material)
      // this.scene.add(cube)

      const loader = new STLLoader();
      loader.load(
        `${serverURL}/meshes/base_link.STL`,
        (geometry) => {
          const base_link = new THREE.Mesh(geometry, material)
          this.scene.add(base_link)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(error)
        }
      )
    })
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render( this.scene, this.camera);
    this.stats.update();
  }
}
