DIST_DIR := dist

default: clean compile-agent sdist

clean:
	$(RM) $(DIST_DIR)/*

sdist:
	python3 setup.py sdist

testupload:
	twin upload dist/* -r testpypi
