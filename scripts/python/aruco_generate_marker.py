"""
Script for generating Aruco marker images.

Author: Nathan Sprague
Version: 10/26/2020
"""

import argparse
import cv2
import numpy as np
import os
import sys
import traceback

class CustomFormatter(argparse.ArgumentDefaultsHelpFormatter,
                      argparse.RawDescriptionHelpFormatter):
    """ Trick to allow both defaults and nice formatting in the help. """
    pass


def main():
    try:
        parser = argparse.ArgumentParser(formatter_class=CustomFormatter,
                                        description="Generate a .png image of a specified maker.")
        parser.add_argument('--id', default=1, type=int,
                            help='Marker id to generate')
        parser.add_argument('--size', default=200, type=int,
                            help='Side length in pixels')
        
        dict_options = [s for s in dir(cv2.aruco) if s.startswith("DICT")]
        option_str = ", ".join(dict_options)
        dict_help = "Dictionary to use. Valid options include: {}".format(option_str)
        parser.add_argument('--dictionary', default="DICT_5X5_250", type=str,
                            choices=dict_options,
                            help=dict_help, metavar='')
        args = parser.parse_args()

        dictionary_id = cv2.aruco.__getattribute__(args.dictionary)
        dictionary = cv2.aruco.getPredefinedDictionary(dictionary_id)
        image = np.zeros((args.size, args.size), dtype=np.uint8)

        if cv2.__version__ < "4.7.0":
            image = cv2.aruco.drawMarker(dictionary, args.id, args.size, image, 1)
        else:
            image = cv2.aruco.generateImageMarker(dictionary, args.id, args.size, image, 1)

        output_dir = os.path.join(os.path.dirname(__file__), "../../src/public/ar_tags")
        output_path = os.path.join(output_dir, "marker_{:04d}.png".format(args.id))
        if cv2.imwrite(output_path, image):
            print("https://127.0.0.1:5000/ar_tags/marker_{:04d}.png".format(args.id))
        else:
            print("Failed to write image", file=sys.stderr)

    except Exception as e:
        print("Exception occured:\n" + traceback.format_exc(), file=sys.stderr)



if __name__ == "__main__":
    main()